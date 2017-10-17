import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { DayEventDialogComponent } from '../../../dialogs/day-event-dialog/day-event-dialog.component';
import { DayEvent } from '../../../models/day-event';
import { ServerPageInput } from '../../../common/contracts/api/page-input';
import { IGetParams } from '../../../common/contracts/api/get-params.interface';
import { ToastyService } from 'ng2-toasty';
import { ActivatedRoute, Router } from '@angular/router';
import { MdDialog } from '@angular/material';
import { Model } from '../../../common/contracts/model';
import { Employee, Abilities } from '../../../models/employee';
import { Subscription } from 'rxjs/Rx';
import { AmsLeaveService, AmsAttendanceService, AmsEmployeeService } from '../../../services/ams';
import { Page } from '../../../common/contracts/page';
import { LeaveBalance, Attendance, Leave } from '../../../models/';
import * as _ from 'lodash';
import { DailyAttendance } from '../../../models/daily-attendance';
import { LeaveActionDialogComponent } from '../../../dialogs/leave-action-dialog/leave-action-dialog.component';
import { Shift } from '../../../models/shift';
import { ShiftType } from '../../../models/shift-type';
import * as moment from 'moment';
import { AmsShiftService } from '../../../services/ams/ams-shift.service';
import { LocalStorageService } from '../../../services/local-storage.service';
declare var $: any;



@Component({
  selector: 'aqua-attendance-details',
  templateUrl: './attendance-details.component.html',
  styleUrls: ['./attendance-details.component.css']
})
export class AttendanceDetailsComponent implements OnInit, OnDestroy, AfterViewInit {

  subscription: Subscription;
  employee: Model<Employee>;
  shifTypes: Page<ShiftType>;
  empId: string;
  isProcessingAttendance: boolean = false;
  isDownloading: boolean = false;
  selectedDate: Date = new Date();

  attendance: Model<DayEvent>;

  leavesSubmiited: Page<Leave>;
  leaveBalances: Page<LeaveBalance>;
  isShowLeaveAction: boolean = false;

  days: string[] = ['Mon', 'Tue', 'wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  events: DayEvent[] = [];
  emptyStartDays: any[] = [];
  emptyEndDays: any[] = [];
  date: Date = null;

  constructor(private amsEmployeeService: AmsEmployeeService,
    private amsLeaveService: AmsLeaveService,
    private amsShiftService: AmsShiftService,
    private amsAttendanceService: AmsAttendanceService,
    private toastyService: ToastyService,
    private activatedRoute: ActivatedRoute,
    private store: LocalStorageService,
    public dialog: MdDialog,
    private router: Router) {

    this.employee = new Model({
      api: amsEmployeeService.employeesForAdmin,
      properties: new Employee()
    });

    this.attendance = new Model({
      api: amsAttendanceService.attendance,
      properties: new DayEvent()
    });

    this.shifTypes = new Page({
      api: amsShiftService.shiftTypes
    });


    this.leavesSubmiited = new Page({
      api: amsLeaveService.allLeavesOfOrg,
      filters: [{
        field: 'employeeId',
        value: null
      }]
    });

    this.leaveBalances = new Page({
      api: amsLeaveService.leaveBalances,
      filters: [{
        field: 'id',
        value: null
      }]
    });

    this.shifTypes.fetch().catch(err => this.toastyService.error({ title: 'Error', msg: err }));
    this.subscription = activatedRoute.params.subscribe(
      params => {
        this.empId = params['empId'];
        this.leavesSubmiited.filters.properties['employeeId'].value = this.empId;
        this.leaveBalances.filters.properties['id'].value = this.empId;
        this.fetchSubmittedLeaveBalance();
        this.fetchLeavesBalances();
        this.getAttendance(this.selectedDate);
        this.employee.fetch(this.empId).then(
          data => {
            this.checkCurrentAblity();
            if (!this.employee.properties.shiftType)
              this.employee.properties.shiftType = new ShiftType();
          }
        ).catch(err => this.toastyService.error({ title: 'Error', msg: err }));

      }
    );

  }

  changeShift(shiftTypeId: string) {
    let model: any = {
      shiftType: { id: shiftTypeId }
    }
    if (shiftTypeId)
      this.updateEmp(model);
  }

  toggleManual(abilitie: 'trackLocation' | 'shiftNotifier') {
    this.employee.properties.abilities[abilitie] = !this.employee.properties.abilities[abilitie];
    let model: any = {
      abilities: this.employee.properties.abilities
    }
    this.updateEmp(model);
  }
  selectAbility(type: 'maualAttendance' | 'manualByBeacon' | 'manualByGeoFencing' | 'manualByWifi' | 'none') {
    this.employee.properties.abilities.maualAttendance = false;
    this.employee.properties.abilities.manualByGeoFencing = false;
    this.employee.properties.abilities.manualByBeacon = false;
    this.employee.properties.abilities.manualByWifi = false;
    if (type != 'none') {
      this.employee.properties.abilities[type] = true;
    }

    let model: any = {
      abilities: this.employee.properties.abilities
    }
    this.updateEmp(model);

  }

  checkCurrentAblity() {
    this.employee.properties['currentAblitiy'] = 'none'
    if (this.employee.properties.abilities.maualAttendance)
      this.employee.properties.currentAblitiy = 'maualAttendance';
    if (this.employee.properties.abilities.manualByGeoFencing)
      this.employee.properties.currentAblitiy = 'manualByGeoFencing';
    if (this.employee.properties.abilities.manualByBeacon)
      this.employee.properties.currentAblitiy = 'manualByBeacon';
    if (this.employee.properties.abilities.manualByWifi)
      this.employee.properties.currentAblitiy = 'manualByWifi';
  }

  updateEmp(model: any) {
    this.employee.isProcessing = true;
    this.amsEmployeeService.employees.update(this.employee.properties.id, model)
      .then(data => {
        this.employee.isProcessing = false;
        this.checkCurrentAblity();
      })
      .catch(err => { this.employee.isProcessing = false; this.toastyService.error({ title: 'Error', msg: err }) });
  }

  getDate(date: Date): number {
    return new Date(date).getDate()
  };

  fetchLeavesBalances() {
    this.leaveBalances.fetch().then(
      data => {
        _.each(this.leaveBalances.items, (item: LeaveBalance) => {
          item['openingBalance'] = item.daysAvailed;
          item.daysAvailed = Math.abs(item.days - item.daysAvailed);
        })
      }
    ).catch(err => this.toastyService.error({ title: 'Error', msg: err }));
  }

  fetchSubmittedLeaveBalance() {
    this.leavesSubmiited.fetch().then(
      data => {
        let i: any = this.leavesSubmiited.items.find((item: Leave) => {
          return item.status.toLowerCase() == 'submitted'
        });
        if (i)
          this.isShowLeaveAction = true;

      }
    ).catch(err => this.toastyService.error({ title: 'Error', msg: err }));
  }


  getAttendance(date: Date) {
    this.selectedDate = new Date(date)
    this.isProcessingAttendance = true;
    date = new Date(date);
    let y = date.getFullYear(), m = date.getMonth();
    let firstDay = new Date(y, m, 1);
    let lastDay = new Date(y, m + 1, 1);

    let serverPageInput: ServerPageInput = new ServerPageInput();
    serverPageInput.query['fromDate'] = firstDay.toISOString();
    serverPageInput.query['toDate'] = lastDay.toISOString();
    serverPageInput.query['employee'] = this.empId;
    let param: IGetParams = {
      serverPageInput: serverPageInput
    };

    this.amsAttendanceService.attendance.simpleGet(param).then((data: DayEvent[]) => {
      this.events = [];

      let startDay = new Date(firstDay).getDay();
      startDay = startDay == 0 ? 7 : startDay;

      let dateVar: Date = new Date(this.selectedDate);
      let year: number = dateVar.getFullYear();
      let monthInNumber: number = dateVar.getMonth();
      // let totalDaysInMonth: number;

      // _.each(this.months, (value: Month, key: string, obj: Months) => {
      //   if (value.id == m + 1)
      //     totalDaysInMonth = value.days;
      // });

      let lastDateOfMonth: Date = new Date(y, monthInNumber + 1, 0);

      let lastDayOfMonth = lastDateOfMonth.getDate();

      let days: number[] = [];
      for (let i = 0; i < lastDayOfMonth; i++) {
        days.push(i);
      }

      _.each(days, (day: number) => {
        let dateEvent: DayEvent;

        dateEvent = _.find(data, (item: DayEvent) => {
          return new Date(item.ofDate).getDate() == day + 1;
        });

        if (dateEvent) {
          if (!dateEvent.shift) {
            dateEvent['shift'] = new Shift();
            dateEvent.shift.status = 'working';
          }
          dateEvent.status = dateEvent.status ? dateEvent.status.toLowerCase() : '';
          dateEvent.shift.status = dateEvent.shift.status ? dateEvent.shift.status.toLowerCase() : '';
          this.events.push(dateEvent)
        } else {
          let newEvent: DayEvent = new DayEvent();
          newEvent.ofDate = new Date(year, monthInNumber, day + 1).toISOString();
          this.events.push(newEvent);
        }
      })



      this.emptyStartDays = [];
      for (let i = 1; i < startDay; i++) {
        this.emptyStartDays.push(i);
      }
      // this.emptyEndDays = [];
      // for (let i = 0; i < lastDayOfMonth; i++) {
      //   this.emptyEndDays.push(i);
      // }



      // this.events = data;
      this.isProcessingAttendance = false;

    }).catch(err => {
      this.isProcessingAttendance = false;
      this.toastyService.error({ title: 'Error', msg: err });
    });
  }

  updateDayEvent(item: DayEvent) {
    //  let attendanceId = item.id
    this.router.navigate([`/pages/attendances/daily/${this.empId}/attendance-logs/${item.ofDate}`])
    // // if (!item.id) {
    // //   return
    // // }

    // let dialogRef = this.dialog.open(DayEventDialogComponent, { width: '50%' });
    // dialogRef.componentInstance.attendance.ofDate = item.ofDate;
    // dialogRef.componentInstance.isHoliday = false;

    // // if (item.shift && item.shift.status.toLowerCase() == 'holiday' && (item.status !== 'present' && item.status !== 'checkedin' && item.status !== 'missswipe')) {
    // //   dialogRef.componentInstance.isHoliday = true;
    // //   return dialogRef.componentInstance.hloiday = `Holiday: ${item.shift.holiday.name}`;

    // // }

    // // if (item.status.toLowerCase() == 'onleave' && item.shift.status.toLowerCase() == 'working') {
    // //   dialogRef.componentInstance.isHoliday = true;
    // //   return dialogRef.componentInstance.hloiday = `On Leave`;

    // // }

    // let h: number, m: number;
    // if (item.checkIn) {
    //   h = new Date(item.checkIn).getHours();
    //   m = new Date(item.checkIn).getMinutes();
    //   dialogRef.componentInstance.checkIn = `${h < 10 ? '0' + h : h}:${m < 10 ? '0' + m : m}`;
    // } else {
    //   dialogRef.componentInstance.checkIn = null;
    // }

    // if (item.checkOut) {
    //   h = new Date(item.checkOut).getHours();
    //   m = new Date(item.checkOut).getMinutes();
    //   dialogRef.componentInstance.checkOut = `${h < 10 ? '0' + h : h}:${m < 10 ? '0' + m : m}`;
    // } else {
    //   dialogRef.componentInstance.checkOut = null;
    // }


    // dialogRef.componentInstance.attendance.id = item.id;
    // dialogRef.afterClosed().subscribe((attendance: DayEvent) => {
    //   if (attendance) {
    //     this.attendance.properties = attendance;
    //     this.attendance.properties.employee.id = this.empId;
    //     if (this.attendance.properties.hoursWorked) {
    //       let s: Date = new Date(this.attendance.properties.checkIn);
    //       let e: Date = new Date(this.attendance.properties.checkOut);
    //       this.attendance.properties.hoursWorked = Math.floor(Math.abs((e.getTime() - s.getTime()) / 36e5));
    //     }
    //     this.attendance.save().then(
    //       data => {
    //         this.getAttendance(this.selectedDate);
    //       }
    //     ).catch(
    //       err => this.toastyService.error({ title: 'Error', msg: err })
    //       )
    //   }
    // });
  }


  openCalnder() {
    $('#monthSelector').datepicker('show')
  }


  download(byShiftEnd : boolean, byShiftLength : boolean, reportName : string) {
    this.isDownloading = true;
    let serverPageInput: ServerPageInput = new ServerPageInput();
    serverPageInput.query['ofDate'] = this.selectedDate;
    serverPageInput.query['employee'] = this.empId;
    serverPageInput.query['byShiftEnd'] = byShiftEnd;
    serverPageInput.query['byShiftLength'] = byShiftLength;
     reportName = `${reportName}_${this.employee.properties.name}_${moment(this.selectedDate).format('MMM_YY')}_monthlyReport.xlsx`;
    this.amsAttendanceService.donwloadSingleEmpMonthAtte.exportReport(serverPageInput, null, reportName).then(
      data => this.isDownloading = false
    ).catch(err => {
      this.toastyService.error({ title: 'Error', msg: err });
      this.isDownloading = false
    });
  };

  ngOnInit() { }

  ngAfterViewInit() {
    $('#monthSelector').datepicker({
      format: 'M, yy',
      minViewMode: 1,
      maxViewMode: 2,
      autoclose: true
    }).on('changeMonth', (e) => {
      if (new Date(e.date).getFullYear() > new Date().getFullYear()) {
        return this.toastyService.info({ title: 'Info', msg: 'Year should be less than or equal to current Year' })
      }
      this.getAttendance(e.date);

    });

    $("#monthSelector").datepicker("setDate", new Date());

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  isUpdatingLeaveStatus: boolean = false;
  updateStatus(leave: Leave) {
    this.isUpdatingLeaveStatus = true;
    this.amsLeaveService.leaves.update(leave.id, leave, null, `${leave.id}/action`).then(
      data => {
        this.isUpdatingLeaveStatus = false;
        this.fetchSubmittedLeaveBalance();
        this.fetchLeavesBalances();
      }
    ).catch(err => {
      this.isUpdatingLeaveStatus = false;
      this.toastyService.error({ title: 'Error', msg: err });
    })
  }

  accept_reject_leave(leave: Leave, status: string) {

    if (status !== 'rejected') {
      leave.status = status;
      this.updateStatus(leave);

    } else {
      let dialogRef = this.dialog.open(LeaveActionDialogComponent, {
        width: '40%'
      });

      dialogRef.afterClosed().subscribe((reason: string) => {
        if (reason) {
          leave.rejectionReason = reason;
          leave.status = status;
          this.updateStatus(leave)
        }
      });
    }
  }

}
