import { Component, OnInit, AfterViewInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Location } from '@angular/common'
import { Page } from '../../../common/contracts/page';
import { AmsEmployeeService, AmsShiftService, AmsAttendanceService, AmsTimelogsService } from '../../../services/ams';
import { ToastyService } from 'ng2-toasty';
import { MonthAttendance, ShiftType } from '../../../models';
import * as moment from 'moment';
import { Attendance } from '../../../models/daily-attendance';
import { ServerPageInput } from '../../../common/contracts/api/page-input';
import { Employee } from '../../../models';
import { ValidatorService } from '../../../services/validator.service';
import { Model } from '../../../common/contracts/model';
import { MdDialog, MdDialogRef } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Filter } from '../../../common/contracts/filters';
import * as _ from 'lodash';
import { LocalStorageService } from '../../../services/local-storage.service';
import { FileUploader } from 'ng2-file-upload';
import { FileUploaderDialogComponent } from '../../../shared/components/file-uploader-dialog/file-uploader-dialog.component';
import { AddAttendanceLogsComponent } from '../../../shared/components/add-attendance-logs/add-attendance-logs.component';
import { BulkTimeLogsDialogComponent } from '../../../shared/components/bulk-time-logs-dialog/bulk-time-logs-dialog.component';
import { EmsAuthService } from '../../../services/ems/ems-auth.service';
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

  attendancePage: Page<Attendance>;
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
    { field: 'attendanceStates', value: 'present' },
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
    public dialog: MdDialog) {

    const divisionFilter = {
      field: 'divisions',
      value: null
    }
    const userDiv = this.auth.currentRole().employee.division
    if (userDiv && userDiv.name && userDiv.code && userDiv.code !== 'default') {
      divisionFilter.value = [userDiv.name]
    }
    this.attendancePage = new Page({
      api: amsAttendanceService.dailyAttendances,
      location: location,
      filters: ['ofDate', 'name', 'code', 'designations', 'departments', 'supervisorId', divisionFilter, 'contractors', 'userTypes',
        'attendance-status', { field: 'status', value: 'present' }, 'shiftType-id', 'byShiftEnd', 'shiftTypeId', 'byShiftLength',
        'checkInStatus', 'checkIn-status', 'checkInAfter', 'checkInBefore',
        'checkOutStatus', 'checkOut-status', 'checkOutAfter', 'checkOutBefore',
        'hours', 'clocked-status', 'clockedGt', 'clockedLt']
    });

  }

  applyFilters(result) {
    const filters = this.attendancePage.filters.properties;

    const values = result.values;

    filters['name']['value'] = values.employeeName;
    filters['code']['value'] = values.employeeCode;
    filters['departments']['value'] = values.departmentNames;
    filters['designations']['value'] = values.designationNames;
    filters['supervisorId']['value'] = values.supervisorId;
    filters['contractors']['value'] = values.contractorNames;
    filters['divisions']['value'] = values.divisionNames;
    filters['userTypes']['value'] = values.userTypeIds;
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
    $('#dateSelector').datepicker('setDate', this.ofDate);
    this.attendancePage.filters.properties['ofDate']['value'] = moment(this.ofDate).toISOString();
    this.getAttendance();
  }

  getAttendance() {
    this.attendances = [];
    this.attendancePage.fetch().then(page => {
      if (!page || !page.items) { return; }
      this.isPast = moment(this.ofDate).isBefore(new Date(), 'day');
      page.items.forEach(pageItem => {
        const existingAttendance = this.attendances.find(item => item.employee.code === pageItem.employee.code);


        pageItem.timeLogs.forEach(timeLog => {
          const displayTime = timeLog.time
          if (timeLog.type === 'checkOut' && (
            (pageItem.checkOut && moment(timeLog.time).minutes() !== moment(pageItem.checkOut).minutes()) ||
            !pageItem.checkOut)) {
            if (!pageItem.out1) {
              pageItem.out1 = displayTime
            } else if (!pageItem.out2) {
              pageItem.out2 = displayTime
            } else if (!pageItem.out3) {
              pageItem.out3 = displayTime
            }
          }

          if (timeLog.type === 'checkIn' && (
            (pageItem.checkIn && moment(timeLog.time).minutes() !== moment(pageItem.checkIn).minutes()) ||
            !pageItem.checkIn)) {
            if (!pageItem.in2) {
              pageItem.in2 = displayTime
            } else if (!pageItem.in3) {
              pageItem.in3 = displayTime
            } else if (!pageItem.in4) {
              pageItem.in4 = displayTime
            }
          }
        })
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

      this.attendancePage.filters.properties['ofDate']['value'] = moment(e.date).toISOString()
      this.ofDate = moment(e.date).startOf('day').toDate()

      setTimeout(() => this.getAttendance(), 1)
    });
    $('#dateSelector').datepicker('setDate', new Date());

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
      url_csv: 'assets/formats/attendance.csv',
      url_xlsx: 'assets/formats/attendance.xlsx'
    }];
  }


}
