import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common'
import { AmsEmployeeService } from '../../../services/ams/ams-employee.service';
import { Page } from '../../../common/contracts/page';
import { ToastyService } from 'ng2-toasty';
import { ServerPageInput } from '../../../common/contracts/api/page-input';
import * as moment from 'moment';
import { ShiftType } from '../../../models/shift-type';
import { EffectiveShift } from '../../../models/effective-shift';
import { AmsEffectiveShiftService } from '../../../services/ams/ams-effective-shift.service';
import { AmsShiftService } from '../../../services/ams/ams-shift.service';
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { LocalStorageService } from '../../../services/local-storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MdDialogRef, MdDialog } from '@angular/material';
import { FileUploaderDialogComponent } from '../../../shared/components/file-uploader-dialog/file-uploader-dialog.component';
declare var $: any;


@Component({
  selector: 'aqua-roster-shifts',
  templateUrl: './roster-shifts.component.html',
  styleUrls: ['./roster-shifts.component.css'],
})
export class RosterShiftsComponent implements OnInit {
  dates: any = [];
  effectiveShifts: Page<EffectiveShift>;
  shiftTypes: Page<ShiftType>;
  change: any;
  date = new Date();
  isDateToday = moment().startOf('day').toDate();
  selectedDate = new Date();

  isDownloading = false;
  isLoading = true;
  isUpload = false;
  isFilter: boolean;

  constructor(
    public activatedRoute: ActivatedRoute,
    private location: Location,
    public router: Router,
    public dialog: MdDialog,
    private amsEmployeeService: AmsEmployeeService,
    private amsShiftService: AmsShiftService,
    private amsEffectiveShiftService: AmsEffectiveShiftService,
    private toastyService: ToastyService,
  ) {

    this.shiftTypes = new Page({
      api: amsShiftService.shiftTypes
    });

    this.date = moment(this.activatedRoute.queryParams['value']['fromDate']).startOf('week').toDate()

    this.effectiveShifts = new Page({
      api: amsEffectiveShiftService.effectiveShifts,
      filters: [{
        field: 'fromDate',
        value: this.date.toISOString()
      }, {
        field: 'name',
        value: this.activatedRoute.queryParams['value']['name']
      }, {
        field: 'code',
        value: this.activatedRoute.queryParams['value']['code']
      }, {
        field: 'designation',
        value: this.activatedRoute.queryParams['value']['designation']
      }, {
        field: 'shiftType',
        value: this.activatedRoute.queryParams['value']['shiftType']
      }, {
        field: 'byShiftEnd',
        value: this.activatedRoute.queryParams['value']['byShiftEnd']
      }, {
        field: 'byShiftLength',
        value: this.activatedRoute.queryParams['value']['byShiftLength']
      }, {
        field: 'tagIds',
        value: ''
      }],
      location: location
    });

    this.shiftTypes.fetch().catch((err) => {
      this.toastyService.error({ title: 'Error', msg: err })
    });
  }
  applyFilters($event) {
    this.effectiveShifts.filters.properties['shiftType']['value'] = $event.shiftType;
    this.effectiveShifts.filters.properties['name']['value'] = $event.employeeName;
    this.effectiveShifts.filters.properties['code']['value'] = $event.employeeCode;
    this.effectiveShifts.filters.properties['tagIds']['value'] = $event.tagIds;
    this.getEffectiveShift(this.date)
  }

  reset() {
    this.effectiveShifts.filters.reset();
    $('#weekSelector').datepicker('setDate', new Date());
    this.effectiveShifts.filters.properties['ofDate']['value'] = new Date();
    this.getAttendance();
  }

  employeeUpdated(effectiveShift: EffectiveShift) {

  }

  resetShifts() {
    this.amsEffectiveShiftService.effectiveShifts.simplePost({}, 'reset').then(() => {
      this.toastyService.info({ title: 'Status', msg: 'Submitted' })
    })
  }

  import() {

    const dialogRef: MdDialogRef<FileUploaderDialogComponent> = this.dialog.open(FileUploaderDialogComponent);
    const component = dialogRef.componentInstance;
    component.uploader = this.amsEffectiveShiftService.effectiveShifts;
    component.samples = [{
      name: 'CSV/Excel',
      mapper: 'default',
      url_csv: 'assets/formats/weekly-roaster.csv',
      url_xlsx: 'assets/formats/weekly-roaster.xlsx'
    }];
    component.name = 'Weekly Roaster';
    dialogRef.afterClosed().subscribe();
  }

  export() {
    this.router.navigate(['pages/attendances/reports'], { queryParams: { type: 'weekly-roaster' } });
  };
  createWeekPicker() {
    $('#weekSelector').datepicker({
      format: 'dd/mm/yyyy',
      minViewMode: 0,
      maxViewMode: 2,
      autoclose: true
    }).on('changeDate', (e) => {
      e.date = moment(e.date).startOf('week')
      this.date = e.date;
      this.getAttendance();
      // this.getEffectiveShift(e.date);
    })
    $('#weekSelector').datepicker('setDate', moment(this.activatedRoute.queryParams['value']['fromDate']).startOf('week').toDate());
  }

  createDaySelector(){

    $('#daySelector').datepicker({
      format: 'dd/mm/yyyy',
      minViewMode: 0,
      maxViewMode: 2,
      autoclose: true
    }).on('changeDate', (ch) => {
      this.selectedDate = ch.date
      this.date = ch.date;
      this.getAttendance();
    })
    $('#daySelector').datepicker('setDate', this.selectedDate);

  }

  getWeek(currentDate) {
    this.dates = [];
    let startOfWeek = moment(currentDate).startOf('week')
    const endOfWeek = moment(currentDate).endOf('week')
    while (startOfWeek <= endOfWeek) {
      this.dates.push(startOfWeek.toDate());
      startOfWeek = startOfWeek.clone().add(1, 'd');
    }
  }

  getEffectiveShift(date: Date) {
    this.isLoading = true;
    this.effectiveShifts.filters.properties['fromDate']['value'] = moment(date).startOf('week').toISOString();
    this.effectiveShifts.fetch().then(() => {
      this.getWeek(this.date);
      this.isLoading = false;
    }).catch(err => this.toastyService.error({ title: 'Error', msg: err }));

  }

  toggleDynamicShift(employee) {
    employee.isDynamicShift = !employee.isDynamicShift;
    this.amsEmployeeService.employees.update(employee.id, employee).then().catch(err => {
      employee.isDynamicShift = !employee.isDynamicShift;
      this.toastyService.error({ title: 'Error', msg: err })
    });
  }

  changeShift(shiftTypeId, date, employee) {
    if (!shiftTypeId || !date) {
      return this.toastyService.info({ title: 'Info', msg: 'Please select Shift' });
    }
    let model: any = {};
    model = {
      date: date,
      newShiftType: shiftTypeId
    }
    this.updateEffectiveShift(employee.id, model);

  }
  getAttendance() {
    this.shiftTypes.fetch().catch(err => this.toastyService.error({ title: 'Error', msg: err }));
    this.getEffectiveShift(this.date);

  }

  nextWeek() {
    this.date = moment(this.date).add(7, 'd').toDate()
    this.getAttendance()
  }

  previousWeek() {
    this.date = moment(this.date).add(-7, 'd').toDate()
    this.getAttendance()
  }

  updateEffectiveShift(id, model: any) {
    this.isLoading = true;
    this.amsEffectiveShiftService.effectiveShifts.update(id, model)
      .then(() => {
        this.isLoading = false;
      })
      .catch(err => { this.toastyService.error({ title: 'Error', msg: err }) });
  }

  shiftColour(shiftType) {
    return this.amsShiftService.shiftColour(shiftType)
  }

  getData($event){
    this.date = $event;
    this.getEffectiveShift(this.date);
  }

  getEmployeeStatus($event){
    this.toggleDynamicShift($event)
  }

  ngOnInit() {
    const week = this.activatedRoute.snapshot.params['week']
    if (week) {
      this.effectiveShifts.filters.properties['fromDate']['value'] = moment(week).startOf('week').toISOString();
    }
  }

  ngAfterViewInit() {
    this.createWeekPicker();
    this.createDaySelector()
    this.getAttendance()
  }
}
