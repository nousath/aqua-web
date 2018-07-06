import { Component, OnInit } from '@angular/core';
import { AmsEmployeeService } from '../../../services/ams/ams-employee.service';
import { Page } from '../../../common/contracts/page';
import { Model } from '../../../common/contracts/model';
import { ToastyService } from 'ng2-toasty';
import { ServerPageInput } from '../../../common/contracts/api/page-input';
import * as moment from 'moment';
import { ShiftType } from '../../../models/shift-type';
import { EffectiveShift } from '../../../models/effective-shift';
import { AmsEffectiveShiftService } from '../../../services/ams/ams-effective-shift.service';
import { AmsShiftService } from '../../../services/ams/ams-shift.service';
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import * as _ from 'lodash';
import { LocalStorageService } from '../../../services/local-storage.service';
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

  isDownloading = false;
  uploader: FileUploader;
  isLoading = true;
  isUpload = false;
  isFilter: boolean;
  constructor(private amsEmployeeService: AmsEmployeeService,
    private amsShiftService: AmsShiftService,
    private amsEffectiveShiftService: AmsEffectiveShiftService,
    private toastyService: ToastyService,
    private store: LocalStorageService) {

    const access_Token: string = this.store.getItem('ams_token');
    const orgCode = this.store.getItem('orgCode');
    this.uploader = new FileUploader({
      url: '/ams/api/effectiveShifts/shiftUpdate/xl',
      itemAlias: 'record',
      headers: [{
        name: 'x-access-token',
        value: access_Token
      }, {
        name: 'org-code',
        value: orgCode
      }]
    });

    this.uploader.onAfterAddingAll = (fileItems: FileItem) => {

    };

    this.uploader.onErrorItem = (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
      console.log('onErrorItem', response, headers);
    };

    this.uploader.onCompleteItem = (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
      this.isDownloading = true;
      const res: any = JSON.parse(response);
      if (!res.isSuccess) {
        this.isDownloading = false;
        return toastyService.error({ title: 'Error', msg: 'excel upload failed' })
      }
      this.isDownloading = false;
      this.isUpload = false;
      this.getEffectiveShift(new Date())
    };

    this.shiftTypes = new Page({
      api: amsShiftService.shiftTypes
    });

    this.effectiveShifts = new Page({
      api: amsEffectiveShiftService.effectiveShifts,
      filters: [{
        field: 'fromDate',
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
      }, {
        field: 'byShiftLength',
        value: false
      }, {
        field: 'tagIds',
        value: ''
      }]
    });

    this.shiftTypes.fetch().catch((err) => {
      this.toastyService.error({ title: 'Error', msg: err })
    });
  }
  applyFilters($event) {

    this.effectiveShifts.filters.properties['shiftType']['value'] = $event.shiftType ? $event.shiftType.id : null;
    this.effectiveShifts.filters.properties['name']['value'] = $event.employeeName;
    this.effectiveShifts.filters.properties['code']['value'] = $event.employeeCode;
    this.effectiveShifts.filters.properties['tagIds']['value'] = $event.tagIds;
    this.getEffectiveShift(this.date)
  }

  reset() {
    this.effectiveShifts.filters.reset();
    $('#dateSelector').datepicker('setDate', new Date());
    this.effectiveShifts.filters.properties['ofDate']['value'] = new Date();
    this.getAttendance();
  }


  download(date: Date) {
    this.isDownloading = true;
    const serverPageInput: ServerPageInput = new ServerPageInput();
    serverPageInput.query['ofDate'] = date.toISOString();
    const reportName = `rosterExcel_${moment().format('DD_MMM_YY')}_DailyReport.xlsx`;
    this.amsEffectiveShiftService.downloadRosterExcel.exportReport(serverPageInput, null, reportName)
      .then(
      (data) => {
        this.isDownloading = false
      }).catch(err => {
        this.toastyService.error({ title: 'Error', msg: err });
        this.isDownloading = false
      });
  };

  excel() {
    this.isUpload = !this.isUpload;
    this.uploader.clearQueue();
  }
  // AfterViewInit() {
  //   $('#dateSelector').datepicker({
  //     format: 'dd/mm/yyyy',
  //     minViewMode: 0,
  //     maxViewMode: 2,
  //     autoclose: true
  //   }).on('changeDate', (e) => {
  //     this.getEffectiveShift(e.date);
  //     this.getWeek(e.date);
  //   })
  //   $('#dateSelector').datepicker('setDate', new Date(new Date().setHours(0, 0, 0, 0)));
  // }

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

    // this.date = date;
    // date = new Date(date);
    this.shiftTypes.fetch().catch(err => this.toastyService.error({ title: 'Error', msg: err }));
    this.getEffectiveShift(this.date);
    this.getWeek(this.date);
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

  shiftColour = function (shiftType) {
    let str = 'random';

    if (shiftType && shiftType.id) {
      str = shiftType.id;
    }

    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let colour = '#';
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xFF;
      colour += ('00' + value.toString(16)).substr(-2);
    }
    return colour;
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.getAttendance()
  }
}
