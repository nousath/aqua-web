import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common'
import { Page } from '../../../common/contracts/page';
import { AmsEmployeeService, AmsShiftService, AmsAttendanceService } from '../../../services/ams';
import { ToastyService } from 'ng2-toasty';
import { MonthAttendance, ShiftType } from '../../../models';
import * as moment from 'moment';
import { DailyAttendance } from '../../../models/daily-attendance';
import { ServerPageInput } from '../../../common/contracts/api/page-input';
import { Employee } from '../../../models';
import { ValidatorService } from '../../../services/validator.service';
import { Model } from '../../../common/contracts/model';
import { MdDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Filter } from '../../../common/contracts/filters';
import * as _ from "lodash";
import { LocalStorageService } from '../../../services/local-storage.service';
import { AmsTagService } from '../../../services/ams/ams-tag.service';
import { TagType, Tag } from '../../../models/tag';
declare var $: any;

export interface SelectedTag {
  tagId: string;
  tagTypeId: string;
}

export class Tags {
  selected: SelectedTag[] = [];
  select(tag: SelectedTag) {
    let t: SelectedTag = _.find(this.selected, (i: SelectedTag) => {
      return i.tagTypeId == tag.tagTypeId;
    });
    if (t && tag.tagId == 'select an option')
      return this.selected.splice(this.selected.indexOf(t), 1);
    if (!t)
      this.selected.push(tag);
  }
  reset() {
    this.selected = [];
  }
}


@Component({
  selector: 'aqua-daily',
  templateUrl: './daily.component.html',
  styleUrls: ['./daily.component.css']
})
export class DailyComponent implements OnInit, AfterViewInit, OnDestroy {

  dailyAttendnace: Page<DailyAttendance>;
  isFilter: boolean = false;
  shiftTypes: Page<ShiftType>;
  employee: Model<Employee>;
  tagTypes: Page<TagType>;
  tags: Tags = new Tags();
  date: Date = null

  constructor(private amsEmployeeService: AmsEmployeeService,
    private amsShiftService: AmsShiftService,
    public validatorService: ValidatorService,
    public activatedRoute: ActivatedRoute,
    public router: Router,
    private store: LocalStorageService,
    private tagService: AmsTagService,
    private location: Location,
    private amsAttendanceService: AmsAttendanceService,
    private toastyService: ToastyService) {


    this.employee = new Model({
      api: amsEmployeeService.employees,
      properties: new Employee()
    });

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

    this.shiftTypes = new Page({
      api: amsShiftService.shiftTypes
    });

    this.tagTypes = new Page({
      api: tagService.tagTypes
    });

    this.shiftTypes.fetch().catch(err => this.toastyService.error({ title: 'Error', msg: err }));
    this.tagTypes.fetch().catch(err => this.toastyService.error({ title: 'Error', msg: err }));

    this.checkFiltersInStore();

  }

  addTag(id: string) {
    console.log(id)
  }



  reset() {
    this.dailyAttendnace.filters.reset();
    this.tags.reset();
    let tagElements: any[] = document.getElementsByName('tags') as any;
    if (tagElements) {
      tagElements.forEach(item => item.value = '');
    }
    this.store.removeItem("daily-attendance-filter");
    $("#dateSelector").datepicker("setDate", new Date());
    this.getAttendance(new Date());
    
  }

  checkFiltersInStore() {
    let filters: any = this.store.getObject('daily-attendance-filter');
    if (filters) {
      this.isFilter = true;
      // this.dailyAttendnace.filters.properties['ofDate']['value'] = filters['ofDate'] || new Date();
      this.dailyAttendnace.filters.properties['name']['value'] = filters['name'] || null;
      this.dailyAttendnace.filters.properties['code']['value'] = filters['code'] || null;
      this.dailyAttendnace.filters.properties['shiftTypeId']['value'] = filters['shiftTypeId'] || null;
    }
    this.getAttendance(this.dailyAttendnace.filters.properties['ofDate']['value'] || new Date());
  }

  setFiltersToStore() {
    let queryParams: any = {};
    _.each(this.dailyAttendnace.filters.properties, (filter: Filter, key: any, obj: any) => {
      if (filter.value) {
        queryParams[key] = filter.value;
      }
    })
    if (queryParams) {
      this.store.setObject('daily-attendance-filter', queryParams);
    }
  }

  getAttendance(date: Date) {
    this.setFiltersToStore();
    this.date = date;
    date = new Date(date);
    this.dailyAttendnace.filters.properties['ofDate']['value'] = date.toISOString();
    let tags: string[] = [];
    _.each(this.tags.selected, (tag: SelectedTag) => {
      tags.push(tag.tagId)
    })
    this.dailyAttendnace.filters.properties['tagIds']['value'] = tags;
    this.dailyAttendnace.fetch().catch(err => this.toastyService.error({ title: 'Error', msg: err }));
  }


  isDownloading: boolean = false;
  download(byShiftEnd: boolean, byShiftLength: boolean, reportName: string) {
    this.isDownloading = true;
    let serverPageInput: ServerPageInput = new ServerPageInput();
    let queryParams: any = {};
    _.each(this.dailyAttendnace.filters.properties, (filter: Filter, key: any, obj: any) => {
      if (filter.value) {
        queryParams[key] = filter.value;
      }
    });
    queryParams['byShiftEnd'] = byShiftEnd;
    queryParams['byShiftLength'] = byShiftLength;
    serverPageInput.query = queryParams;
    reportName = `${reportName}_${moment(queryParams['ofDate']).format('DD_MMM_YY')}_DailyReport.xlsx`;
    this.amsAttendanceService.donwloadDailyAttendances.exportReport(serverPageInput, null, reportName).then(
      data => this.isDownloading = false
    ).catch(err => {
      this.toastyService.error({ title: 'Error', msg: err });
      this.isDownloading = false
    });
  };


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
      this.getAttendance(e.date);
    });
    $("#dateSelector").datepicker("setDate", new Date());
  }

  ngOnDestroy() {

  }

}
