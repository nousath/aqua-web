import { Component, OnInit, OnDestroy, AfterViewInit, Input } from '@angular/core';
import { ToastyService } from 'ng2-toasty';
import { ActivatedRoute, Router } from '@angular/router';
import { MdDialog } from '@angular/material';
import { DetailModel } from '../../../common/ng-structures';
import { Employee, Abilities } from '../../../models/employee';
import { AmsLeaveService, AmsAttendanceService, AmsEmployeeService } from '../../../services/ams';
import { PagerModel } from '../../../common/ng-structures';
import { LeaveBalance, Attendance, Leave, User } from '../../../models';
import * as _ from 'lodash';
import { LeaveActionDialogComponent } from '../../../dialogs/leave-action-dialog/leave-action-dialog.component';
import { ShiftType } from '../../../models/shift-type';
import * as moment from 'moment';
import { Location } from '@angular/common';
import { AmsShiftService } from '../../../services/ams/ams-shift.service';
import { LocalStorageService } from '../../../services/local-storage.service';
import { EmsEmployeeService } from '../../../services/ems';
import { ResetPasswordDialogComponent } from '../../../dialogs/reset-password-dialog/reset-password-dialog.component';
import { EmsAuthService } from '../../../services/ems/ems-auth.service';
import { DatesService } from '../../../shared/services/dates.service';
import { PageOptions } from '../../../common/ng-api';
import { EmsEmployee } from '../../../models/ems/employee';
declare var $: any;



@Component({
  selector: 'aqua-attendance-details',
  templateUrl: './attendance-details.component.html',
  styleUrls: ['./attendance-details.component.css']
})
export class AttendanceDetailsComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input()
  empId: string;

  // subscription: Subscription;
  emsEmployee: EmsEmployee;
  employee: DetailModel<Employee>;
  user: string;
  shifTypes: PagerModel<ShiftType>;
  ofDate: any;
  isProcessing = false;
  selectedDate = new Date();

  isUpdatingLeaveStatus = false;
  // attendance: DetailModel<DayEvent>;

  leaves: PagerModel<Leave>;
  leaveBalances: PagerModel<LeaveBalance>;
  isShowLeaveAction = false;

  date = new Date();
  today = new Date(moment().startOf('day').toDate()).toISOString();

  constructor(
    private amsEmployeeService: AmsEmployeeService,
    private emsEmployeeService: EmsEmployeeService,
    private amsLeaveService: AmsLeaveService,
    amsShiftService: AmsShiftService,
    private amsAttendanceService: AmsAttendanceService,
    public auth: EmsAuthService,
    private toastyService: ToastyService,
    private activatedRoute: ActivatedRoute,
    private store: LocalStorageService,
    public dialog: MdDialog,
    public _location: Location,
    private router: Router) {

    this.employee = new DetailModel({
      api: amsEmployeeService.employeesForAdmin,
      properties: new Employee()
    });

    this.shifTypes = new PagerModel({
      api: amsShiftService.shiftTypes
    });


    this.leaves = new PagerModel({
      api: amsLeaveService.allLeavesOfOrg,
      filters: [{
        field: 'employeeId',
        value: null
      }]
    });

    this.leaveBalances = new PagerModel({
      api: amsLeaveService.leaveBalances,
      filters: [{
        field: 'id',
        value: null
      }]
    });

    this.shifTypes.fetch().catch(err => this.toastyService.error({ title: 'Error', msg: err }));

    if (this.activatedRoute.snapshot.queryParams['month']) {
      this.selectedDate = new Date(this.activatedRoute.snapshot.queryParams['month'])
    }

    activatedRoute.params.subscribe(params => {
      if (params['empId']) {
        this.empId = params['empId'];
        this.setEmployee()
      }
    });

    this.activatedRoute.queryParams.subscribe(query => {
      if (query.month) {
        this.date = new Date(query.month)
      }
    })
  }

  setEmployee() {
    this.leaves.filters.properties['employeeId'].value = this.empId;
    this.leaveBalances.filters.properties['id'].value = this.empId;
    this.fetchSubmittedLeaveBalance();
    this.fetchLeavesBalances();
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
    this.leaves.fetch().then(
      data => {
        const i: any = this.leaves.items.find((item: Leave) => {
          return item.status.toLowerCase() === 'submitted'
        });
        if (i)
          this.isShowLeaveAction = true;

      }
    ).catch(err => this.toastyService.error({ title: 'Error', msg: err }));
  }
  openCalender() {
    $('#monthSelector').datepicker('show')
  }


  download(byShiftEnd: boolean, byShiftLength: boolean, reportName: string) {
    this.isProcessing = true;
    const pageOptions = new PageOptions();
    pageOptions.query['ofDate'] = this.selectedDate;
    pageOptions.query['employee'] = this.empId;
    pageOptions.query['byShiftEnd'] = byShiftEnd;
    pageOptions.query['byShiftLength'] = byShiftLength;
    reportName = `${reportName}_${this.employee.properties.name}_${moment(this.selectedDate).format('MMM_YY')}_monthlyReport.xlsx`;
    this.amsAttendanceService.donwloadSingleEmpMonthAtte.exportReport(pageOptions, null, reportName).then(
      data => this.isProcessing = false
    ).catch(err => {
      this.toastyService.error({ title: 'Error', msg: err });
      this.isProcessing = false
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
      this.date = e.date;
    });

    $('#monthSelector').datepicker('setDate', this.selectedDate);

  }

  showNextMonth() {
    this.date = moment(this.date).add(1, 'month').toDate();
    $('#monthSelector').datepicker('setDate', this.date);
  }

  showPreviousMonth() {
    this.date = moment(this.date).subtract(1, 'month').toDate();
    $('#monthSelector').datepicker('setDate', this.date);
  }

  ngOnDestroy() {
    // this.subscription.unsubscribe();
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

  errorHandler = (err) => {
    this.isProcessing = false;
    this.toastyService.error({ title: 'Error', msg: err });
  }

  resetPassword() {
    const dialog = this.dialog.open(ResetPasswordDialogComponent, { width: '40%' });
    dialog.afterClosed().subscribe((password: string) => {
      this.isProcessing = true;

      if (password) {
        const emp: any = {
          password: password,
          code: this.employee.properties.code
        };
        this.emsEmployeeService.employees.update(this.employee.id, emp).then(data => {
          this.isProcessing = false;
          this.toastyService.success({ title: 'Success', msg: 'Password updated successfully' });
        }).catch(this.errorHandler);
      }
    });
  }
  backClicked() {
    this._location.back();
  }


}
