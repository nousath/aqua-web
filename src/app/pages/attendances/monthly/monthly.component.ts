import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Location } from '@angular/common'
import { PagerModel } from '../../../common/ng-structures';
import { ToastyService } from 'ng2-toasty';
import * as moment from 'moment';
import { MonthAttendance, Employee } from '../../../models';
import { AmsAttendanceService } from '../../../services/ams';
import { ValidatorService } from '../../../services/validator.service';
// import * as $ from 'jquery';
import { DetailModel } from '../../../common/ng-structures';
import { Router, ExtraOptions, NavigationExtras } from '@angular/router';
import * as _ from 'lodash';
import { EmsAuthService } from '../../../services';

declare var $: any;

@Component({
  selector: 'aqua-monthly',
  templateUrl: './monthly.component.html',
  styleUrls: ['./monthly.component.css']
})
export class MonthlyComponent implements OnInit, AfterViewInit {

  monthlyAttendance: PagerModel<MonthAttendance>;
  employee: DetailModel<Employee>;
  isFilter = false;
  date = new Date();
  showDatePicker = false;

  filterFields = [
    'name',
    'code',
    'designations',
    'supervisor',
    'departments',
    'userTypes',
    'contractors',
    'divisions'
  ]

  isDownloading = false;
  isProcessing = false;

  constructor(
    private amsAttendanceService: AmsAttendanceService,
    public validatorService: ValidatorService,
    public auth: EmsAuthService,
    private router: Router,
    private location: Location,
    private toastyService: ToastyService) {
    const divisionFilter = {
      field: 'divisions',
      value: null
    }
    const userDiv = this.auth.currentRole().employee.division
    if (userDiv && userDiv.name && userDiv.code && userDiv.code !== 'default') {
      divisionFilter.value = [userDiv.name]
    }
    this.monthlyAttendance = new PagerModel({
      api: amsAttendanceService.monthlyAttendances,
      location: location,
      filters: ['ofDate', 'name', 'code', 'designations', 'departments', 'supervisorId', 'userTypes', 'tagIds', 'contractors', divisionFilter]
    });
  }

  reset() {
    this.monthlyAttendance.filters.reset();
    $('#monthSelector').datepicker('setDate', new Date());
    this.monthlyAttendance.filters.properties['ofDate']['value'] = moment().toISOString();
    this.getAttendance();
  }

  applyFilters(result) {
    const filters = this.monthlyAttendance.filters.properties;
    const values = result.params
    filters['name']['value'] = values.employee && values.employee.name ? values.employee.name : '';
    filters['code']['value'] = values.employee && values.employee.code ? values.employee.code : '';
    filters['departments']['value'] = values.employee && values.employee.departments ? values.employee.departments.map(item => item.name) : '';
    filters['designations']['value'] = values.employee && values.employee.designations ? values.employee.designations.map(item => item.name) : '';
    filters['divisions']['value'] = values.employee && values.employee.divisions ? values.employee.divisions.map(item => item.name) : '';
    filters['supervisorId']['value'] = values.employee && values.employee.supervisor ? values.employee.supervisor.id : '';
    filters['contractors']['value'] = values.employee && values.employee.contractors ? values.employee.contractors.map(item => item.name) : '';
    filters['userTypes']['value'] = values.employee && values.employee.userTypes ? values.employee.userTypes.map(item => item.code) : '';

    this.getAttendance();
  }

  getAttendance() {
    this.isProcessing = true;
    this.monthlyAttendance.filters.properties['ofDate']['value'] = this.date.toISOString();
    this.monthlyAttendance.fetch().then(() => {
      this.isProcessing = false;
    }).catch(err => {
      this.isProcessing = false;
      this.toastyService.error({ title: 'Error', msg: err })
    });
  }

  downloadlink() {
    this.router.navigate(['pages/attendances/reports'], { queryParams: { type: 'monthly-attendance' } })
  }

  regenerate() {
    const model = {
      period: 'month',
      date: this.monthlyAttendance.filters.properties['ofDate']['value'] || moment().toISOString()
    }

    this.amsAttendanceService.attendance.simplePost(model, 'regenerate').then(() => {
      this.toastyService.info({ title: 'Status', msg: 'Request submitted. Kindly reload' })
    })
  }

  showNextMonth() {
    this.date = moment(this.date).add(1, 'month').toDate();
    $('#monthSelector').datepicker('setDate', this.date);
    this.getAttendance();
  }

  showPreviousMonth() {
    this.date = moment(this.date).subtract(1, 'month').toDate();
    $('#monthSelector').datepicker('setDate', this.date);
    this.getAttendance();
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
      this.date = e.date;
      this.getAttendance()
    });

    $('#monthSelector').datepicker('setDate', this.date);

  }

};

