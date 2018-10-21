import { Component, OnInit, AfterViewInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Location } from '@angular/common'
import { Page } from '../../../common/contracts/page';
import { AmsEmployeeService, AmsShiftService, AmsAttendanceService } from '../../../services/ams';
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
import { AmsTagService } from '../../../services/ams/ams-tag.service';
import { TagType, Tag } from '../../../models/tag';
import { FileUploader } from 'ng2-file-upload';
import { FileUploaderDialogComponent } from '../../../shared/components/file-uploader-dialog/file-uploader-dialog.component';
import { AddAttendanceLogsComponent } from '../../../shared/components/add-attendance-logs/add-attendance-logs.component';
import { BulkTimeLogsDialogComponent } from '../../../shared/components/bulk-time-logs-dialog/bulk-time-logs-dialog.component';
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

  dailyAttendnace: Page<Attendance>;
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
    'supervisor',
    'shiftTypes',
    'attendanceStates',

    'clocked',
    'checkIn',
    'checkOut',
  ]



  attendances: Attendance[] = [];

  constructor(
    public validatorService: ValidatorService,
    public activatedRoute: ActivatedRoute,
    public router: Router,
    private location: Location,
    private amsAttendanceService: AmsAttendanceService,
    private toastyService: ToastyService,
    public dialog: MdDialog) {


    this.dailyAttendnace = new Page({
      api: amsAttendanceService.dailyAttendances,
      location: location,
      filters: ['ofDate', 'name', 'code', 'designations', 'departments', 'tagIds',
        'status', 'attendance-status', 'shiftType-id', 'byShiftEnd', 'shiftTypeId', 'byShiftLength',
        'checkInStatus', 'checkIn-status', 'checkIn-after', 'checkIn-before',
        'checkOutStatus', 'checkOut-status', 'checkOut-after', 'checkOut-before',
        'hours', 'clocked-status', 'clocked-gt', 'clocked-lt']
    });

  }

  applyFilters(values) {
    const filters = this.dailyAttendnace.filters.properties;

    filters['name']['value'] = values.employee.name || null;
    filters['code']['value'] = values.employee.code || null;
    filters['departments']['value'] = values.employee.departments.map(item => item.name) || null;
    filters['designations']['value'] = values.employee.designations.map(item => item.name) || null;
    filters['tagIds']['value'] = values.employee.tags.map(item => item.id) || null;

    filters['shiftTypeId']['value'] = values.shiftType.map(item => item.id) || null;
    // filters['shiftType-id']['value'] = values.shiftType.map(item => item.id) || null;

    filters['status']['value'] = values.attendance.status.map(item => item.id) || null;

    filters['checkInStatus']['value'] = values.attendance.checkIn.status.map(item => item.id) || null;
    // filters['checkIn-status']['value'] = values.attendance.checkIn.status.map(item => item.id) || null;
    filters['checkIn-after']['value'] = values.attendance.checkIn.after || null;
    filters['checkIn-before']['value'] = values.attendance.checkIn.before || null;

    filters['checkOutStatus']['value'] = values.attendance.checkOut.status.map(item => item.id) || null;
    // filters['checkOut-status']['value'] = values.attendance.checkOut.status.map(item => item.id) || null;
    filters['checkOut-after']['value'] = values.attendance.checkOut.after || null;
    filters['checkOut-before']['value'] = values.attendance.checkOut.before || null;

    filters['hours']['value'] = values.attendance.clocked.status.map(item => item.id) || null;
    // filters['clocked-status']['value'] = values.attendance.clocked.status.map(item => item.id) || null;
    filters['clocked-gt']['value'] = values.attendance.clocked.hours.greaterThan || null;
    filters['clocked-lt']['value'] = values.attendance.clocked.hours.lessThan || null;

    this.getAttendance();
  }

  reset() {
    this.dailyAttendnace.filters.reset();
    $('#dateSelector').datepicker('setDate', this.ofDate);
    this.dailyAttendnace.filters.properties['ofDate']['value'] = moment(this.ofDate).toISOString();
    this.getAttendance();
  }

  getAttendance() {
    this.attendances = [];
    this.dailyAttendnace.fetch().then(page => {
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

      this.dailyAttendnace.filters.properties['ofDate']['value'] = moment(e.date).toISOString()
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
    this.router.navigate([`/pages/attendances/daily/${empId}/attendance-logs/${this.ofDate}`])
    // }
  }
  regenerate() {
    const model = {
      period: 'day',
      date: this.dailyAttendnace.filters.properties['ofDate']['value'] || moment().toISOString()
    }
    this.amsAttendanceService.attendance.simplePost(model, 'regenerate').then(() => {
      this.toastyService.info({ title: 'Status', msg: 'Submitted' })
      this.toastyService.info({ title: 'Info', msg: 'Kindly reload' })

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
