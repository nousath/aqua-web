import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common'
import { AmsEmployeeService } from '../../../services/ams/ams-employee.service';
import { Page } from '../../../common/contracts/page';
import { ToastyService } from 'ng2-toasty';
import * as moment from 'moment';
import { ShiftType } from '../../../models/shift-type';
import { EffectiveShift } from '../../../models/effective-shift';
import { AmsEffectiveShiftService } from '../../../services/ams/ams-effective-shift.service';
import { AmsShiftService } from '../../../services/ams/ams-shift.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MdDialogRef, MdDialog } from '@angular/material';
import { FileUploaderDialogComponent } from '../../../shared/components/file-uploader-dialog/file-uploader-dialog.component';
import { EmsAuthService } from '../../../services/ems/ems-auth.service';
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

  filterFields = [
    'name',
    'code',
    'userTypes',
    'contractors',
    'designations',
    'departments',
    'divisions',
    'supervisor',
    'shiftTypes',
  ]

  constructor(
    public activatedRoute: ActivatedRoute,
    private location: Location,
    public router: Router,
    public dialog: MdDialog,
    private auth: EmsAuthService,
    private amsEmployeeService: AmsEmployeeService,
    private amsShiftService: AmsShiftService,
    private amsEffectiveShiftService: AmsEffectiveShiftService,
    private toastyService: ToastyService,
  ) {

    const queryParams = this.activatedRoute.snapshot.queryParams || {};

    const divisionFilter = {
      field: 'divisions',
      value: null
    }
    const userDiv = this.auth.currentRole().employee.division
    if (userDiv && userDiv.name && userDiv.code && userDiv.code !== 'default') {
      divisionFilter.value = [userDiv.name]
    }
    this.shiftTypes = new Page({
      api: amsShiftService.shiftTypes
    });

    this.date = moment(queryParams['fromDate']).startOf('week').toDate()

    this.effectiveShifts = new Page({
      api: amsEffectiveShiftService.effectiveShifts,
      filters: [
        'fromDate',
        'name',
        'code',
        divisionFilter,
        'contractors',
        'departments',
        'designations',
        'shiftType',
        'byShiftEnd',
        'byShiftLength',
        'tagIds',
        'userTypes',
        'supervisorId'
      ],
      location: location
    });

    this.shiftTypes.fetch().catch((err) => {
      this.toastyService.error({ title: 'Error', msg: err })
    });
  }
  applyFilters(result) {
    this.effectiveShifts.pageNo = 1;
    const values = result.params;
    const filters = this.effectiveShifts.filters.properties;

    filters['name']['value'] = values.employee && values.employee.name ? values.employee.name : '';
    filters['code']['value'] = values.employee && values.employee.code ? values.employee.code : '';
    filters['departments']['value'] = values.employee && values.employee.departments ? values.employee.departments.map(item => item.name) : '';
    filters['designations']['value'] = values.employee && values.employee.designations ? values.employee.designations.map(item => item.name) : '';
    filters['divisions']['value'] = values.employee && values.employee.divisions ? values.employee.divisions.map(item => item.name) : '';
    filters['supervisorId']['value'] = values.employee && values.employee.supervisor ? values.employee.supervisor.id : '';
    filters['contractors']['value'] = values.employee && values.employee.contractors ? values.employee.contractors.map(item => item.name) : '';
    filters['userTypes']['value'] = values.employee && values.employee.userTypes ? values.employee.userTypes.map(item => item.id) : '';
    filters['shiftType']['value'] = values.shiftType && values.shiftType.map(item => item.id) || null;
    this.getEffectiveShift(this.date)
  }

  reset() {
    this.effectiveShifts.filters.reset();
    this.effectiveShifts.pageNo = 1;

    const date = moment().startOf('week').toDate()
    $('#weekSelector').datepicker('setDate', date);
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
    $('#weekSelector').datepicker('setDate', this.date);
  }

  showNextWeek() {
    this.date = moment(this.date).add(7, 'd').startOf('week').toDate();
    $('#weekSelector').datepicker('setDate', this.date);
    this.getAttendance();
  }

  showPreviousWeek() {
    this.date = moment(this.date).subtract(7, 'd').startOf('week').toDate();
    $('#weekSelector').datepicker('setDate', this.date);
    this.getAttendance();
  }

  createDaySelector() {

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
    this.effectiveShifts.filters.properties['fromDate']['value'] = moment(this.date).startOf('week').toDate().toISOString()
    this.shiftTypes.fetch().catch(err => this.toastyService.error({ title: 'Error', msg: err }));
    this.getEffectiveShift(this.date);

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

  getData($event) {
    this.date = $event;
    this.getEffectiveShift(this.date);
  }

  getEmployeeStatus($event) {
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
