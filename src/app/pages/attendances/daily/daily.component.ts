import { Component, OnInit, AfterViewInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Location } from '@angular/common'
import { PagerModel } from '../../../common/ng-structures';
import { AmsEmployeeService, AmsShiftService, AmsAttendanceService, AmsTimelogsService } from '../../../services/ams';
import { ToastyService } from 'ng2-toasty';
import { MonthAttendance, ShiftType } from '../../../models';
import * as moment from 'moment';
import { Attendance } from '../../../models/daily-attendance';
import { Employee } from '../../../models';
import { ValidatorService } from '../../../services/validator.service';
import { DetailModel } from '../../../common/ng-structures';
import { MdDialog, MdDialogRef } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { LocalStorageService } from '../../../services/local-storage.service';
import { FileUploader } from 'ng2-file-upload';
import { FileUploaderDialogComponent } from '../../../shared/components/file-uploader-dialog/file-uploader-dialog.component';
import { AddAttendanceLogsComponent } from '../../../shared/components/add-attendance-logs/add-attendance-logs.component';
import { BulkTimeLogsDialogComponent } from '../../../shared/components/bulk-time-logs-dialog/bulk-time-logs-dialog.component';
import { EmsAuthService } from '../../../services/ems/ems-auth.service';
import { DatesService } from '../../../shared/services/dates.service';
declare var $: any;

@Component({
  selector: 'aqua-daily',
  templateUrl: './daily.component.html',
  styleUrls: ['./daily.component.css']
})
export class DailyComponent {


  @Output()
  data: EventEmitter<any> = new EventEmitter();

  isPast = false;

  attendancePage: PagerModel<Attendance>;
  isFilter = false;
  isUpload = false;
  uploader: FileUploader;
  selectedDate: String;
  ofDate: Date;
  // data: Attendance;


  filterFields = [
    'name',
    'code',
    'designations',
    'departments',
    'userTypes',
    'contractors',
    'divisions',
    'supervisor',
    'shiftTypes',
    // {field: 'attendanceStates', value: 'present'},
  'attendanceStates',
    'clocked',
    'checkIn',
    'checkOut',
  ]



  attendances: Attendance[] = [];

  constructor(
    public validatorService: ValidatorService,
    public activatedRoute: ActivatedRoute,
    private auth: EmsAuthService,
    public router: Router,
    private location: Location,
    private amsAttendanceService: AmsAttendanceService,
    private amsTimelogsService: AmsTimelogsService,
    private toastyService: ToastyService,
    private datesService: DatesService,
    public dialog: MdDialog) {

    const divisionFilter = {
      field: 'divisions',
      value: null
    }
    const userDiv = this.auth.currentRole().employee.division
    if (userDiv && userDiv.name && userDiv.code && userDiv.code !== 'default') {
      divisionFilter.value = [userDiv.name]
    }
    this.attendancePage = new PagerModel({
      api: amsAttendanceService.dailyAttendances,
      location: location,
      filters: ['ofDate', 'name', 'code', 'designations', 'departments', 'supervisorId', divisionFilter, 'contractors', 'userTypes',
        'attendance-status', 'status',  'shiftType-id', 'byShiftEnd', 'shiftTypeId', 'byShiftLength',
        'checkInStatus', 'checkIn-status', 'checkInAfter', 'checkInBefore',
        'checkOutStatus', 'checkOut-status', 'checkOutAfter', 'checkOutBefore',
        'hours', 'clocked-status', 'clockedGt', 'clockedLt']
    });

    if (this.activatedRoute.snapshot.queryParams['ofDate']) {
      this.ofDate = new Date(this.activatedRoute.snapshot.queryParams['ofDate'])
    } else {
      this.ofDate = new Date()
    }

    this.activatedRoute.queryParams.subscribe(query => {
      this.ofDate = query['ofDate'] ? new Date(query['ofDate']) : new Date();
      this.getAttendance();
    })
  }

  applyFilters(result) {
    this.attendancePage.pageNo = 1;
    const filters = this.attendancePage.filters.properties;
    const values = result.values;
    filters['name']['value'] = values.employeeName;
    filters['code']['value'] = values.employeeCode;
    filters['departments']['value'] = values.departmentNames;
    filters['designations']['value'] = values.designationNames;
    filters['supervisorId']['value'] = values.supervisorId;
    filters['contractors']['value'] = values.contractorNames;
    filters['divisions']['value'] = values.divisionNames;
    filters['userTypes']['value'] = values.userTypes ? values.userTypes.map(item => item.code) : '';
    filters['shiftTypeId']['value'] = values.shiftTypeIds;
    // filters['shiftType-id']['value'] = values.shiftType.map(item => item.id) || null;

    filters['status']['value'] = values.attendanceStates;

    filters['checkInStatus']['value'] = values.checkInStates;
    // filters['checkIn-status']['value'] = values.attendance.checkIn.status.map(item => item.id) || null;
    filters['checkInAfter']['value'] = values.checkInAfter;
    filters['checkInBefore']['value'] = values.checkInBefore;

    filters['checkOutStatus']['value'] = values.checkOutStates;
    // filters['checkOut-status']['value'] = values.attendance.checkOut.status.map(item => item.id) || null;
    filters['checkOutAfter']['value'] = values.checkOutAfter;
    filters['checkOutBefore']['value'] = values.checkOutBefore;

    filters['hours']['value'] = values.clockedStates;
    // filters['clocked-status']['value'] = values.attendance.clocked.status.map(item => item.id) || null;
    filters['clockedGt']['value'] = values.clockedGreaterThan;
    filters['clockedLt']['value'] = values.clockedLessThan

    this.getAttendance();
  }

  reset() {
    this.attendancePage.filters.reset();
    this.attendancePage.pageNo = 1;
    $('#dateSelector').datepicker('setDate', this.ofDate);
    this.getAttendance();
  }

  getAttendance() {
    this.attendances = [];
    this.attendancePage.filters.properties['ofDate']['value'] = moment(this.ofDate).toISOString()
    this.attendancePage.fetch().then(page => {
      if (!page || !page.items) { return; }
      this.isPast = moment(this.ofDate).isBefore(new Date(), 'day');
      page.items.forEach(pageItem => {
        const existingAttendance = this.attendances.find(item => item.employee.code === pageItem.employee.code);
        if (existingAttendance) {
          if (!existingAttendance.checkIn || existingAttendance.checkIn > pageItem.checkIn) {
            existingAttendance.checkIn = pageItem.checkIn;
          }

          if (!existingAttendance.checkOut || existingAttendance.checkOut < pageItem.checkOut) {
            existingAttendance.checkOut = pageItem.checkOut;
          }
        } else {
          this.attendances.push(pageItem);
        }
      });
    }).catch(err => this.toastyService.error({ title: 'Error', msg: err }));
  }

  addAttendance(item: Attendance) {
    const dialogRef: MdDialogRef<BulkTimeLogsDialogComponent> = this.dialog.open(BulkTimeLogsDialogComponent, {
      panelClass: 'app-full-bleed-dialog',
      width: '50%',
      data: {}
    });
  }

  showBulkTimeLogsDialog() {
    const dialogRef: MdDialogRef<BulkTimeLogsDialogComponent> = this.dialog.open(BulkTimeLogsDialogComponent, {
      panelClass: 'app-full-bleed-dialog',
      width: '50%',
      height: '50%',
      data: {}

    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAttendance()
      }
    });
  }
  ngOnInit() {
    this.datesService.date(this.ofDate).isPast()
  }

  ngAfterViewInit() {
    $('#dateSelector').datepicker({
      format: 'dd/mm/yyyy',
      minViewMode: 0,
      maxViewMode: 2,
      autoclose: true,
      maxDate: new Date()
    }).on('changeDate', (e) => {
      if (new Date(e.date) > new Date()) {
        return this.toastyService.info({ title: 'Info', msg: 'Date should be less than or equal to current date' })
      }

      this.ofDate = moment(e.date).startOf('day').toDate()
      setTimeout(() => this.getAttendance(), 1)
    });
    $('#dateSelector').datepicker('setDate', this.ofDate);

  }

  showNextDate() {
    const nextDate = moment(this.ofDate).add(1, 'd').toDate();

    if (nextDate < new Date()) {
      this.ofDate = nextDate;
      $('#dateSelector').datepicker('setDate', this.ofDate);
      this.getAttendance();
    } else {
      this.toastyService.info({ title: 'Max Date', msg: `You cannot browse to future date` })
    }

  }

  showPreviousDate() {
    this.ofDate = moment(this.ofDate).subtract(1, 'd').toDate();
    $('#dateSelector').datepicker('setDate', this.ofDate);
    this.getAttendance();
  }
  downloadlink(type: string) {
    this.router.navigate(['pages/attendances/reports'], { queryParams: { type: type } });
  }
  updateDayEvent(empId: string) {
    // if (item.ofDate < new Date().toISOString()) {
    this.router.navigate([`/attendances/${empId}/logs`], {
      queryParams: {
        ofDate: this.ofDate.toISOString()
      }
    })
    // }
  }

  resetLogs() {
    const model = {
      date: this.attendancePage.filters.properties['ofDate']['value'] || moment().toISOString()
    }
    this.amsTimelogsService.timeLogs.simplePost(model, 'regenerate').then(() => {
      this.toastyService.info({ title: 'Info', msg: 'Kindly reload after some time' })
    })
  }
  regenerate() {
    const model = {
      period: 'day',
      date: this.attendancePage.filters.properties['ofDate']['value'] || moment().toISOString()
    }
    this.amsAttendanceService.attendance.simplePost(model, 'regenerate').then(() => {
      this.toastyService.info({ title: 'Info', msg: 'Kindly reload after some time' })

    })
  }

  clearAction(item: any) {
    const id = item.id
    const model = item
    this.amsAttendanceService.attendance.update(null, model, null, `${id}/clearAction`).then(() => {
      this.getAttendance();
      this.toastyService.info({ title: 'Status', msg: 'Submitted' })
    })
  }

  import() {
    const dialogRef: MdDialogRef<FileUploaderDialogComponent> = this.dialog.open(FileUploaderDialogComponent);
    const component = dialogRef.componentInstance;
    component.uploader = this.amsAttendanceService.dailyAttendances
    component.samples = [{
      name: 'Add-Timelogs',
      mapper: 'default',
      url_xlsx: 'assets/formats/attendance.xlsx'
    }];
  }


}
