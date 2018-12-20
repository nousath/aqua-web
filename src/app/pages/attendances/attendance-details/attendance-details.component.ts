import { Component, OnInit, OnDestroy, AfterViewInit, Input } from '@angular/core';
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
import { LeaveBalance, Attendance, Leave, User } from '../../../models';
import * as _ from 'lodash';
import { DailyAttendance } from '../../../models/daily-attendance';
import { LeaveActionDialogComponent } from '../../../dialogs/leave-action-dialog/leave-action-dialog.component';
import { Shift } from '../../../models/shift';
import { ShiftType } from '../../../models/shift-type';
import * as moment from 'moment';
import { Location } from '@angular/common';
import { AmsShiftService } from '../../../services/ams/ams-shift.service';
import { LocalStorageService } from '../../../services/local-storage.service';
import { EmsEmployeeService } from '../../../services';
import { ResetPasswordDialogComponent } from '../../../dialogs/reset-password-dialog/reset-password-dialog.component';
import { EmsAuthService } from '../../../services/ems/ems-auth.service';
declare var $: any;



@Component({
  selector: 'aqua-attendance-details',
  templateUrl: './attendance-details.component.html',
  styleUrls: ['./attendance-details.component.css']
})
export class AttendanceDetailsComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input()
  empId: string;

  subscription: Subscription;
  employee: Model<Employee>;
  user: string;
  shifTypes: Page<ShiftType>;
  ofDate: any;
  isProcessingAttendance = false;
  isDownloading = false;
  selectedDate: Date = new Date();

  isUpdatingLeaveStatus = false;
  attendance: Model<DayEvent>;

  leavesSubmiited: Page<Leave>;
  leaveBalances: Page<LeaveBalance>;
  isShowLeaveAction = false;
  days: string[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  events: DayEvent[] = [];
  emptyStartDays: any[] = [];
  emptyEndDays: any[] = [];
  date: any;
  today = new Date(moment().startOf('day').toDate()).toISOString();

  constructor(
    private amsEmployeeService: AmsEmployeeService,
    private emsEmployeeService: EmsEmployeeService,
    private amsLeaveService: AmsLeaveService,
    private amsShiftService: AmsShiftService,
    private amsAttendanceService: AmsAttendanceService,
    public auth: EmsAuthService,
    private toastyService: ToastyService,
    private activatedRoute: ActivatedRoute,
    private store: LocalStorageService,
    public dialog: MdDialog,
    public _location: Location,
    private router: Router) {
    // this.today=new Date(moment().startOf("day").toDate()).toISOString();

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
    this.subscription = activatedRoute.params.subscribe(params => {
      if (params['empId']) {
        this.empId = params['empId'];
        this.setEmployee()
      }
    });
  }

  setEmployee() {
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

  changeShift(shiftTypeId: string) {
    const model: any = {
      shiftType: { id: shiftTypeId }
    }
    if (shiftTypeId)
      this.updateEmp(model);
  }

  toggleManual(abilitie: 'trackLocation' | 'shiftNotifier') {
    this.employee.properties.abilities[abilitie] = !this.employee.properties.abilities[abilitie];
    const model: any = {
      abilities: this.employee.properties.abilities
    }
    this.updateEmp(model);
  }
  selectAbility(type: 'maualAttendance' | 'manualByBeacon' | 'manualByGeoFencing' | 'manualByWifi' | 'none') {
    this.employee.properties.abilities.maualAttendance = false;
    this.employee.properties.abilities.manualByGeoFencing = false;
    this.employee.properties.abilities.manualByBeacon = false;
    this.employee.properties.abilities.manualByWifi = false;
    if (type !== 'none') {
      this.employee.properties.abilities[type] = true;
    }

    const model: any = {
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
        const i: any = this.leavesSubmiited.items.find((item: Leave) => {
          return item.status.toLowerCase() === 'submitted'
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
    const y = date.getFullYear(), m = date.getMonth();
    const firstDay = new Date(y, m, 1);
    const lastDay = new Date(y, m + 1, 1);

    const serverPageInput: ServerPageInput = new ServerPageInput();
    serverPageInput.query['fromDate'] = firstDay.toISOString();
    serverPageInput.query['toDate'] = lastDay.toISOString();
    serverPageInput.query['employee'] = this.empId;
    const param: IGetParams = {
      serverPageInput: serverPageInput
    };

    this.amsAttendanceService.attendance.simpleGet(param).then((data: DayEvent[]) => {
      this.events = [];

      let startDay = new Date(firstDay).getDay();
      startDay = startDay === 0 ? 7 : startDay;

      const dateVar: Date = new Date(this.selectedDate);
      const year: number = dateVar.getFullYear();
      const monthInNumber: number = dateVar.getMonth();
      // let totalDaysInMonth: number;


      // _.each(this.months, (value: Month, key: string, obj: Months) => {
      //   if (value.id === m + 1)
      //     totalDaysInMonth = value.days;
      // });

      const lastDateOfMonth: Date = new Date(y, monthInNumber + 1, 0);

      const lastDayOfMonth = lastDateOfMonth.getDate();

      const days: number[] = [];
      for (let i = 0; i < lastDayOfMonth; i++) {
        days.push(i);
      }

      _.each(days, (day: number) => {
        let dateEvent: DayEvent;

        dateEvent = _.find(data, (item: DayEvent) => {
          return new Date(item.ofDate).getDate() === day + 1;
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
          const newEvent: DayEvent = new DayEvent();
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
    if (item.ofDate < new Date().toISOString()) {
      this.router.navigate([`/attendances/daily/${this.empId}/attendance-logs/${item.ofDate}`])
    }
  }
  openCalnder() {
    $('#monthSelector').datepicker('show')
  }


  download(byShiftEnd: boolean, byShiftLength: boolean, reportName: string) {
    this.isDownloading = true;
    const serverPageInput: ServerPageInput = new ServerPageInput();
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

  ngOnInit() {
    this.setEmployee();
  }

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

    $('#monthSelector').datepicker('setDate', new Date());

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

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
      const dialogRef = this.dialog.open(LeaveActionDialogComponent, {
        width: '40%'
      });

      dialogRef.afterClosed().subscribe((reason: string) => {
        if (reason) {
          leave.comment = reason;
          leave.status = status;
          this.updateStatus(leave)
        }
      });
    }
  }
  resetPassword() {
    const dialog = this.dialog.open(ResetPasswordDialogComponent, { width: '40%' });
    dialog.afterClosed().subscribe(
      (password: string) => {
        if (password) {
          this.employee.isProcessing = true;
          let emsUserID: number;
          const emp: any = {
            password: password
          };
          emsUserID = this.store.getItem('emsUserId')
          this.emsEmployeeService.employees.update(emsUserID, emp)
            .then(data => {
              this.employee.isProcessing = false;
              this.toastyService.success({ title: 'Success', msg: 'Password updated successfully' });
            })
            .catch(err => { this.employee.isProcessing = false; this.toastyService.error({ title: 'Error', msg: err }) });
        }
      }
    );
  }
  backClicked() {
    this._location.back();
  }

  regenerate() {
    const model = {
      employee: this.employee,
      period: 'month',
      date: this.attendance.properties['ofDate'] || moment().toISOString()
    }
    this.amsAttendanceService.attendance.simplePost(model, 'regenerate').then(() => {
      this.toastyService.info({ title: 'Status', msg: 'Submitted' })
      this.toastyService.info({ title: 'Info', msg: 'Kindly reload' })
    })
  }
}
