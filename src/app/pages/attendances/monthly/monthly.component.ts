import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Location } from '@angular/common';
import { Page } from '../../../common/contracts/page';
import { ToastyService } from 'ng2-toasty';
import * as moment from 'moment';
import { ServerPageInput } from '../../../common/contracts/api/page-input';
import { MonthAttendance, ShiftType, Employee } from '../../../models';
import { AmsAttendanceService, AmsEmployeeService, AmsShiftService } from '../../../services/ams';
import { ValidatorService } from '../../../services/validator.service';
// import * as $ from 'jquery';
import { MdDialog } from '@angular/material';
import { ConfirmDialogComponent } from '../../../dialogs/confirm-dialog/confirm-dialog.component';
import { Model } from '../../../common/contracts/model';
import { ActivatedRoute, Router, ExtraOptions, NavigationExtras } from '@angular/router';
import * as _ from 'lodash';
import { Filter } from '../../../common/contracts/filters';
import { Subscription } from 'rxjs/Rx';
import { LocalStorageService } from '../../../services/local-storage.service';
import { TagType, Tag } from '../../../models/tag';
import { AmsTagService } from '../../../services/ams/ams-tag.service';
import { Tags, SelectedTag } from '../daily/daily.component';
import { Http, ResponseContentType } from '@angular/http';
declare var $: any;

@Component({
  selector: 'aqua-monthly',
  templateUrl: './monthly.component.html',
  styleUrls: ['./monthly.component.css']
})
export class MonthlyComponent implements OnInit, AfterViewInit {

  monthlyAttendnace: Page<MonthAttendance>;
  employee: Model<Employee>;
  shiftTypes: Page<ShiftType>;
  isFilter = false;
  date: Date = null;
  showDatePicker = false;
  subscription: Subscription;
  org: any;

  tagTypes: Page<TagType>;
  tags: Tags = new Tags();

  constructor(private amsEmployeeService: AmsEmployeeService,
    private amsAttendanceService: AmsAttendanceService,
    public validatorService: ValidatorService,
    private amsShiftService: AmsShiftService,
    private location: Location,
    private tagService: AmsTagService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private store: LocalStorageService,
    private dialog: MdDialog,
    private http: Http,
    private toastyService: ToastyService) {

    this.employee = new Model({
      api: amsEmployeeService.employees,
      properties: new Employee()
    });

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
        field: 'designation',
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
      }]
    });

    this.shiftTypes = new Page({
      api: amsShiftService.shiftTypes
    });

    this.tagTypes = new Page({
      api: tagService.tagTypes
    });
    this.org = this.store.getItem('orgCode');
    this.tagTypes.fetch().catch(err => this.toastyService.error({ title: 'Error', msg: err }));
    this.shiftTypes.fetch().catch(err => this.toastyService.error({ title: 'Error', msg: err }));
    this.checkFiltersInStore();

  }



  reset() {
    this.monthlyAttendnace.filters.reset();
    this.tags.reset();
    const tagElements: any[] = document.getElementsByName('tags') as any;
    if (tagElements) {
      tagElements.forEach(item => item.value = '');
    }
    this.store.removeItem('monthly-attendance-filters');
    this.getAttendance(new Date());

  }


  checkFiltersInStore() {
    const filters: any = this.store.getObject('monthly-attendance-filters');
    if (filters) {
      this.isFilter = true;
      // this.monthlyAttendnace.filters.properties['ofDate']['value'] = filters['ofDate'] || new Date();
      this.monthlyAttendnace.filters.properties['name']['value'] = filters['name'] || null;
      this.monthlyAttendnace.filters.properties['code']['value'] = filters['code'] || null;
      this.monthlyAttendnace.filters.properties['designation']['value'] = filters['code'] || null;
      this.monthlyAttendnace.filters.properties['shiftType']['value'] = filters['shiftType'] || null;
    }
    this.getAttendance(this.monthlyAttendnace.filters.properties['ofDate']['value'] || new Date());
  }

  setFiltersToStore() {
    const queryParams: any = {};
    _.each(this.monthlyAttendnace.filters.properties, (filter: Filter, key: any, obj: any) => {
      if (filter.value) {
        queryParams[key] = filter.value;
      }
    })
    if (queryParams) {
      this.store.setObject('monthly-attendance-filters', queryParams);
    }
  }

  getAttendance(date: Date) {
    this.setFiltersToStore();
    this.date = new Date(date);
    date = new Date(date);
    this.monthlyAttendnace.filters.properties['ofDate']['value'] = date.toISOString();

    const tags: string[] = [];
    _.each(this.tags.selected, (tag: SelectedTag) => {
      tags.push(tag.tagId)
    })
    this.monthlyAttendnace.filters.properties['tagIds']['value'] = tags;

    this.monthlyAttendnace.fetch().catch(err => this.toastyService.error({ title: 'Error', msg: err }));

  }

  isDownloading = false;
  download(byShiftEnd: boolean, byShiftLength: boolean, reportName: string) {
    this.isDownloading = true;
    const serverPageInput: ServerPageInput = new ServerPageInput();
    const queryParams: any = {};
    _.each(this.monthlyAttendnace.filters.properties, (filter: Filter, key: any, obj: any) => {
      if (filter.value) {
        queryParams[key] = filter.value;
      }
    });
    queryParams['byShiftEnd'] = byShiftEnd;
    queryParams['byShiftLength'] = byShiftLength;
    serverPageInput.query = queryParams;
    reportName = `${reportName}_${moment(queryParams['ofDate']).format('MMM_YY')}_monthlyReport.xlsx`;
    this.amsAttendanceService.donwloadMonthlyAttendances.exportReport(serverPageInput, null, reportName).then(
      data => this.isDownloading = false
    ).catch(err => {
      this.toastyService.error({ title: 'Error', msg: err });
      this.isDownloading = false;
    });
  }

  // downloadPdf(jobName) {
  //   this.isDownloading = true;
  //   const queryParams: any = {};
  //   _.each(this.monthlyAttendnace.filters.properties, (filter: Filter, key: any, obj: any) => {
  //     if (filter.value) {
  //       queryParams[key] = filter.value;
  //     }
  //   });
  //   const atomsUrl = `http://atoms-api.m-sas.com/api/docs/${jobName}_${this.org}/${queryParams['ofDate']}.pdf?clientCode=msas`;
  //   this.http.get(atomsUrl, { responseType: ResponseContentType.Blob }).toPromise().then(response => {
  //     const fileName = `${moment(queryParams['ofDate']).format('MMM_YY')}_monthlyReport.pdf`;
  //     const blob = new Blob([response['_body']], { type: 'application/pdf' });
  //     const objectUrl = window.URL.createObjectURL(blob);
  //     const a = document.createElement('a');
  //     a.href = objectUrl;
  //     a.download = fileName;
  //     a.click();
  //     URL.revokeObjectURL(objectUrl);
  //     document.body.appendChild(a);
  //     document.body.removeChild(a);
  //     this.isDownloading = false;
  //   }).catch(err => {
  //     this.toastyService.error({ title: 'Error', msg: err });
  //     this.isDownloading = false;
  //   });
  // }

  ngOnInit() {
  }

  ngAfterViewInit() {
    $('#monthSelector').datepicker({
      format: 'M, yy',
      minViewMode: 1,
      maxViewMode: 2,
      autoclose: true
    }).on('changeMonth', (e) => {
      this.getAttendance(e.date);
    });

    $('#monthSelector').datepicker('setDate', new Date());

  }

};

