import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Page } from '../../../common/contracts/page';
import { ToastyService } from 'ng2-toasty';
import * as moment from 'moment';
import { ServerPageInput } from '../../../common/contracts/api/page-input';
import { MonthAttendance, Employee } from '../../../models';
import { AmsAttendanceService } from '../../../services/ams';
import { ValidatorService } from '../../../services/validator.service';
// import * as $ from 'jquery';
import { Model } from '../../../common/contracts/model';
import { Router, ExtraOptions, NavigationExtras } from '@angular/router';
import * as _ from 'lodash';
declare var $: any;

@Component({
  selector: 'aqua-monthly',
  templateUrl: './monthly.component.html',
  styleUrls: ['./monthly.component.css']
})
export class MonthlyComponent implements OnInit, AfterViewInit {

  monthlyAttendnace: Page<MonthAttendance>;
  employee: Model<Employee>;
  isFilter = false;
  date: Date = null;
  showDatePicker = false;

  filterFields = [
    'name',
    'code',
    'designations',
    'departments',
    'userTypes',
    'contractors'
  ]

  isDownloading = false;


  constructor(
    private amsAttendanceService: AmsAttendanceService,
    public validatorService: ValidatorService,
    private router: Router,
    private toastyService: ToastyService) {

    this.monthlyAttendnace = new Page({
      api: amsAttendanceService.monthlyAttendances,
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
        field: 'shiftType',
        value: null
      }, {
        field: 'byShiftEnd',
        value: false
      },
      {
        field: 'byShiftLength',
        value: false
      }, {
        field: 'tagIds',
        value: ''
      }, {
        field: 'designations',
        value: null
      }, {
        field: 'departments',
        value: null
      }]
    });
  }

  reset() {
    this.monthlyAttendnace.filters.reset();
    $('#monthSelector').datepicker('setDate', new Date());
    this.monthlyAttendnace.filters.properties['ofDate']['value'] = moment().toISOString();
    this.getAttendance();
  }

  applyFilters(result) {

    const filters = this.monthlyAttendnace.filters.properties;

    const values = result.values
    filters['name']['value'] = values.employeeName;
    filters['code']['value'] = values.employeeCode;
    filters['departments']['value'] = values.departmentNames;
    filters['designations']['value'] = values.designationNames;
    // filters['tagIds']['value'] = values.employee.tags.map(item => item.id);

    filters['shiftType']['value'] = values.shiftTypeIds;

    this.getAttendance();
  }

  getAttendance() {
    this.monthlyAttendnace.fetch().catch(err => this.toastyService.error({ title: 'Error', msg: err }));
  }

  downloadlink() {
    this.router.navigate(['pages/attendances/reports'], { queryParams: { type: 'monthly-attendance' } })
  }

  regenerate() {
    const model = {
      period: 'month',
      date: this.monthlyAttendnace.filters.properties['ofDate']['value'] || moment().toISOString()
    }

    this.amsAttendanceService.attendance.simplePost(model, 'regenerate').then(() => {
      this.toastyService.info({ title: 'Status', msg: 'Submitted' })
      this.toastyService.info({ title: 'Info', msg: 'Kindly reload' })
    })
  }

  ngOnInit() {
    this.getAttendance();
  }

  ngAfterViewInit() {
    $('#monthSelector').datepicker({
      format: 'M, yy',
      minViewMode: 1,
      maxViewMode: 2,
      autoclose: true
    }).on('changeMonth', (e) => {
      this.monthlyAttendnace.filters.properties['ofDate']['value'] = e.date;
      setTimeout(() => this.getAttendance(), 1)
    });

    $('#monthSelector').datepicker('setDate', new Date());

  }

};

