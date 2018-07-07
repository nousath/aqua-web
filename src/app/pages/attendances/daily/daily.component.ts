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

  dailyAttendnace: Page<Attendance>;
  isFilter = false;
  isUpload = false;
  uploader: FileUploader;
  // data: Attendance;



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
      filters: [{
        field: 'ofDate',
        value: null
      }, {
        field: 'name',
        value: null
      }, {
        field: 'code',
        value: null
      }, {
        field: 'shiftTypeId',
        value: null
      }, {
        field: 'status',
        value: null
      }, {
        field: 'byShiftEnd',
        value: false
      }, {
        field: 'byShiftLength',
        value: false
      }, {
        field: 'tagIds',
        value: ''
      }],
    });

  }

  applyFilters($event) {

    this.dailyAttendnace.filters.properties['shiftTypeId']['value'] = $event.shiftType ? $event.shiftType.id : null;
    this.dailyAttendnace.filters.properties['name']['value'] = $event.employeeName;
    this.dailyAttendnace.filters.properties['code']['value'] = $event.employeeCode;
    this.dailyAttendnace.filters.properties['status']['value'] = $event.attendanceStatus;

    this.dailyAttendnace.filters.properties['tagIds']['value'] = $event.tagIds;
    this.getAttendance();
  }

  reset() {
    this.dailyAttendnace.filters.reset();
    $('#dateSelector').datepicker('setDate', new Date());
    this.dailyAttendnace.filters.properties['ofDate']['value'] = moment().toISOString();
    this.getAttendance();
  }

  getAttendance() {
    this.attendances = [];
    this.dailyAttendnace.fetch().then(page => {
      if (!page || !page.items) { return; }
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
      width: '50%'
    });
  }

  showBulkTimeLogsDialog() {
    const dialogRef: MdDialogRef<BulkTimeLogsDialogComponent> = this.dialog.open(BulkTimeLogsDialogComponent, {
      panelClass: 'app-full-bleed-dialog',
      width: '50%',
      height: '50%'
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

      setTimeout(() => this.getAttendance(), 1)
    });
    $('#dateSelector').datepicker('setDate', new Date());
  }
  downloadlink(type: string) {
    this.router.navigate(['pages/attendances/reports'], { queryParams: { type: type } });
  }
  import() {
    const dialogRef: MdDialogRef<FileUploaderDialogComponent> = this.dialog.open(FileUploaderDialogComponent);
    const component = dialogRef.componentInstance;
    component.uploader = this.amsAttendanceService.dailyAttendances
    component.samples = [{
      name: 'CSV',
      mapper: 'default',
      url: 'assets/formats/Attendance.csv'
    }];
  }


}
