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
import * as _ from "lodash";
import { Filter } from '../../../common/contracts/filters';
import { Subscription } from 'rxjs/Rx';
import { LocalStorageService } from '../../../services/local-storage.service';
import { TagType, Tag } from '../../../models/tag';
import { AmsTagService } from '../../../services/ams/ams-tag.service';
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
  isFilter: boolean = false;
  date: Date = null;
  showDatePicker: boolean = false;
  subscription: Subscription;

  tagTypes: Page<TagType>;
  tags: Tag[] = [];
  selectedTags: Tag[] = [];

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
        field: 'extraHours',
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

    this.tagTypes.fetch().catch(err => this.toastyService.error({ title: 'Error', msg: err }));
    this.shiftTypes.fetch().catch(err => this.toastyService.error({ title: 'Error', msg: err }));
    this.checkFiltersInStore();

  }

  selectTagType(id: string) {
    let tag: HTMLSelectElement = document.getElementById('tag') as HTMLSelectElement;
    tag.value = '';
    let tagType = _.find(this.tagTypes.items, (i: TagType) => { return i.id == id });
    if (tagType)
      this.tags = tagType['tags'];
    tag.focus();
  }
  addChips(tagId: string) {
    let tag: Tag = _.find(this.tags, (i: Tag) => { return i.id == tagId });
    let tag1 = _.find(this.selectedTags, (i: Tag) => { return i.id == tagId });
    if (tag && !tag1)
      this.selectedTags.push(tag);
  }

  removeChip(index) {
    this.selectedTags.splice(index, 1);
    let tag: HTMLSelectElement = document.getElementById('tag') as HTMLSelectElement;
    tag.value = '';
  }

  reset() {
    this.monthlyAttendnace.filters.reset();
    this.getAttendance(new Date());
    this.selectedTags = [];
    this.store.removeItem('monthly-attendance-filters');

  }


  checkFiltersInStore() {
    let filters: any = this.store.getObject('monthly-attendance-filters');
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
    let queryParams: any = {};
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

    let tags: string[] = [];
    _.each(this.selectedTags, (tag: Tag) => {
      tags.push(tag.id)
    })
    this.monthlyAttendnace.filters.properties['tagIds']['value'] = tags;

    this.monthlyAttendnace.fetch().catch(err => this.toastyService.error({ title: 'Error', msg: err }));

  }

  isDownloading: boolean = false;
  download(extraHours: boolean) {
    this.isDownloading = true;
    let serverPageInput: ServerPageInput = new ServerPageInput();
    let queryParams: any = {};
    _.each(this.monthlyAttendnace.filters.properties, (filter: Filter, key: any, obj: any) => {
      if (filter.value) {
        queryParams[key] = filter.value;
      }
    });
    queryParams['extraHours'] = extraHours;
    serverPageInput.query = queryParams;
    let reportName: string = `${moment(queryParams['ofDate']).format('MMM_YY')}_monthlyReport`;
    reportName = extraHours ? `${reportName}_extraHours` : reportName;
    this.amsAttendanceService.donwloadMonthlyAttendances.exportReport(serverPageInput, null, `${reportName}.xlsx`).then(
      data => this.isDownloading = false
    ).catch(err => {
      this.toastyService.error({ title: 'Error', msg: err });
      this.isDownloading = false
    });
  };



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

    $("#monthSelector").datepicker("setDate", new Date());

  }

};

