import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ShiftType, EffectiveShift, Shift } from '../../../models';
import * as moment from 'moment';
import { AmsEffectiveShiftService, AmsAttendanceService, AmsEmployeeService, AmsLeaveService, AmsShiftService } from '../../../services/ams';
import { ToastyService } from 'ng2-toasty';
import { ServerPageInput } from '../../../common/contracts/api/page-input';
import { LeaveBalance } from '../../../models/leave-balance';
import { Leave } from '../../../models/leave';
import { Employee } from '../../../models/employee';
import { MdDialog } from '@angular/material';
import { LeaveReasonDialogComponent } from '../../../dialogs/leave-reason-dialog/leave-reason-dialog.component';
import { Attendance } from '../../../models/daily-attendance';
import { DayEvent } from '../../../models/day-event';
import { LeaveSummary } from '../../../services/ams/ams-leave.service';
import { AttendanceSummary } from '../../../services/ams/ams-attendance.service';
import { DatesService } from '../../services/dates.service';

@Component({
  selector: 'aqua-shift-picker',
  templateUrl: './shift-picker.component.html',
  styleUrls: ['./shift-picker.component.css']
})
export class ShiftPickerComponent implements OnInit {

  @Output()
  updated: EventEmitter<any> = new EventEmitter();

  @Input()
  shiftTypes: ShiftType[];

  @Input()
  effectiveShift: EffectiveShift;

  @Input()
  date: Date;

  employee: Employee;
  attendance: Attendance;
  daySummary: AttendanceSummary;

  leave: Leave;
  leaveSummary: LeaveSummary;

  day: string;


  shiftSearch: string;

  startingShift: ShiftType;

  isProcessing = false;

  isWeeklyOff = false;
  isDayOff = false;
  isPast = true;
  isToday = false;
  isDynamic = false;
  isOnDuty = false;

  selectedShift: Shift;
  selectedShiftType: ShiftType;
  effectiveShiftType: ShiftType;
  dayShiftType: ShiftType;

  leaveBalances: LeaveBalance[] = [];
  onDutyBalance: LeaveBalance;
  compOffBalance: LeaveBalance;

  // currentDate: ''
  // onSelectedDate = [{
  //   type: '',
  //   date: '',
  //   status: '',
  //   units: ''
  // }]


  days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

  constructor(
    private shiftService: AmsShiftService,
    private amsEmployeeService: AmsEmployeeService,
    private amsEffectiveShiftService: AmsEffectiveShiftService,
    private toastyService: ToastyService,
    private amsLeaveService: AmsLeaveService,
    private amsAttendanceService: AmsAttendanceService,
    private dates: DatesService,
    public dialog: MdDialog
  ) {
  }

  ngOnInit() {
    this.compute();
  }

  compute() {
    this.isDynamic = this.effectiveShift.employee.isDynamicShift;
    this.employee = this.effectiveShift.employee;

    this.isPast = moment(this.date).isBefore(new Date());
    this.isToday = moment(this.date).isSame(new Date(), 'd');
    this.day = this.days[this.date.getDay()]

    if (this.effectiveShift.previousShift) {
      this.startingShift = this.effectiveShift.previousShift.shiftType
    }

    this.computeEffectiveShift()

    this.computeDayShift()
    this.leaveSummary = this.amsLeaveService.getDaySummary(this.effectiveShift.leaves, this.date)
    this.leave = this.leaveSummary.leave;
    this.attendance = this.effectiveShift.attendances.find(item => this.dates.date(item.ofDate).isSame(this.date));
    this.daySummary = this.amsAttendanceService.getSummary(this.attendance, this.leaveSummary)

    this.computeWeeklyOff();
  }

  computeEffectiveShift() {
    this.effectiveShiftType = this.startingShift;
    let lastDate: Date;
    this.effectiveShift.shifts.forEach(item => {
      const mDate = moment(item.date);
      if (mDate.isBefore(this.date, 'd') && (!lastDate || mDate.isAfter(lastDate))) {
        lastDate = mDate.toDate();
        this.effectiveShiftType = item.shiftType
      }
    });
  }

  computeDayShift() {
    this.dayShiftType = this.effectiveShiftType

    const pickerDate = new Date(this.date);
    pickerDate.setHours(0, 0, 0, 0);

    this.effectiveShift.shifts.forEach(item => {

      const itemDate = new Date(item.date);
      itemDate.setHours(0, 0, 0, 0);

      if (itemDate.getTime() !== pickerDate.getTime()) { return; }
      this.selectedShift = item;

      this.shiftTypes.forEach(type => {
        if (type.id === this.selectedShift.shiftType.id) {
          this.selectedShift.shiftType = type;
          this.selectedShiftType = type;
          this.dayShiftType = type;
        }
      })
    });
  }

  computeWeeklyOff() {
    this.isWeeklyOff = false
    if (this.attendance) {
      if (this.attendance.status === 'weekOff' || this.attendance.shift.status === 'weeklyOff') {
        this.isWeeklyOff = true
      }
    } else if (!this.isPast) {
      if (this.employee.weeklyOff && this.employee.weeklyOff.isConfigured) {
        this.isWeeklyOff = this.employee.weeklyOff[this.day];
      } else if (this.dayShiftType[this.day] === 'off') {
        this.isWeeklyOff = true;
      }
    }
  }

  stopPropagation(event) {
    event.stopPropagation();
  }

  shiftColour() {
    return this.shiftService.shiftColour(this.selectedShiftType || this.effectiveShiftType);
  }

  reset() {
    if (this.selectedShift && this.selectedShift.shiftType) {
      this.isProcessing = true;
      this.amsEffectiveShiftService.effectiveShifts
        .remove(this.selectedShift.id).then(() => {
          const index = this.effectiveShift.shifts.findIndex(item => item.id === this.selectedShift.id)
          this.effectiveShift.shifts.splice(index, 1)
          this.selectedShiftType = null;
          this.compute()
          this.updated.next();
          this.isProcessing = false;
        }).catch(this.errorHandler)
    }
  }

  setDayOff() {
    if (this.attendance && this.attendance.status !== 'absent') {
      return;
    }

    this.isDayOff = true;

    const dayEvent = new DayEvent()
    dayEvent.employee = { id: this.employee.id };
    dayEvent.ofDate = this.date.toISOString();
    dayEvent.status = 'weekOff';
    this.isProcessing = true;

    if (this.attendance) {
      this.amsAttendanceService.attendance.update(this.attendance.id, dayEvent).then((item) => {
        this.attendance.status = item.status;
        this.compute()
        this.updated.next();
        this.isProcessing = false;
      }).catch(this.errorHandler)
    } else {
      this.amsAttendanceService.attendance.create(dayEvent).then((item) => {
        const attendance = new Attendance();
        attendance.id = item.id;
        attendance.ofDate = moment(item.ofDate).toDate();
        attendance.shift = item.shift;
        attendance.employee = this.employee;
        attendance.status = item.status;
        this.effectiveShift.attendances = this.effectiveShift.attendances || []
        this.effectiveShift.attendances.push(attendance)
        this.compute()
        this.updated.next();
        this.isProcessing = false;
      }).catch(this.errorHandler);
    }
  }

  setWeeklyOff() {
    const employee = this.effectiveShift.employee;
    this.isWeeklyOff = !this.isWeeklyOff;
    employee.weeklyOff[this.day] = this.isWeeklyOff

    if (this.isWeeklyOff) {
      employee.weeklyOff.isConfigured = true;
    }

    this.amsEmployeeService.employees
      .update(employee.id, employee)
      .then(() => {
        this.selectedShiftType = null;
        this.compute()
        this.updated.next();
        this.isProcessing = false;
      }).catch(err => {
        this.isProcessing = false;
        this.isWeeklyOff = !this.isWeeklyOff;
        this.toastyService.error({ title: 'Error', msg: err })
      });
  }

  getMenuItems() {
    if (this.leave) {
      return;
    }

    const input = new ServerPageInput();
    input.serverPaging = false;
    input.query = {
      id: this.effectiveShift.employee.id,
      employeeId: this.effectiveShift.employee.id
    };

    this.onDutyBalance = null;
    this.compOffBalance = null;
    this.leaveBalances = [];

    this.isProcessing = true;
    this.amsLeaveService.leaveBalances.search(input).then(page => {
      this.leaveBalances = [];
      page.items.forEach(item => {
        const code = item.leaveType.code.toLowerCase();
        if (item.leaveType.unlimited === true &&
          (code === 'dl' || code === 'od')) {
          this.onDutyBalance = item
        } else if (item.days >= 1) {
          if (code === 'co') {
            this.compOffBalance = item
          } else {
            this.leaveBalances.push(item)
          }
        }
      });
      this.isProcessing = false;
    }).catch(this.errorHandler);
  }


  selectShift(newShiftType: ShiftType) {
    if (this.effectiveShiftType && newShiftType && this.effectiveShiftType.id === newShiftType.id) {
      this.selectedShiftType = null;

      if (this.selectedShift && this.selectedShift.shiftType && this.selectedShift.shiftType.id !== newShiftType.id) {
        this.reset()
      }
      return;
    }

    const model: any = {
      date: this.date,
      shiftType: newShiftType
    };
    this.isProcessing = true;
    this.amsEffectiveShiftService.effectiveShifts
      .update(this.effectiveShift.employee.id, model)
      .then((response: any) => {
        this.compute();
        this.selectedShiftType = newShiftType;
        model.id = response.id
        this.selectedShift = model
        this.updated.next();
        this.isProcessing = false;
      }).catch(this.errorHandler)
  }

  setOnDuty() {
    this.setOnLeave(this.onDutyBalance);
  }

  setCompOff() {
    this.applyLeave(this.compOffBalance);
  }

  applyLeave(leaveBalance: LeaveBalance) {
    const dialogRef = this.dialog.open(LeaveReasonDialogComponent, { width: '40%', data: leaveBalance })

    dialogRef.afterClosed().subscribe((response: any) => {
      this.setOnLeave(leaveBalance, response.reason)
    });
  }
  setOnLeave(leaveBalance: LeaveBalance, reason?: string) {
    const leave = new Leave()
    leave.date = this.date;
    leave.toDate = this.date;
    leave.days = 1;
    leave.reason = reason;
    leave.status = 'approved';
    leave.type = leaveBalance.leaveType;
    leave.employee = this.employee;

    this.isProcessing = true;

    this.amsLeaveService.leaves.create(leave).then(item => {
      this.leave = item;
      this.effectiveShift.leaves = this.effectiveShift.leaves || [];
      this.effectiveShift.leaves.push(this.leave);
      this.compute()
      this.updated.next();
      this.isProcessing = false;

    }).catch(this.errorHandler);
  }

  errorHandler = (err) => {
    this.isProcessing = false;
    this.toastyService.error({ title: 'Error', msg: err })
  }
}


