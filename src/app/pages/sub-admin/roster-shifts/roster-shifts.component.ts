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
  isDownloading: boolean = false;
  uploader: FileUploader;
  isLoading = true;
  isUpload: boolean = false;
  constructor(private amsEmployeeService: AmsEmployeeService,
    private amsShiftService: AmsShiftService,
    private amsEffectiveShiftService: AmsEffectiveShiftService,
    private toastyService: ToastyService,
    private store: LocalStorageService) {


    let access_Token: string = this.store.getItem('ams_token');
    let orgCode = this.store.getItem('orgCode');
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
      let res: any = JSON.parse(response);
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
      }]
    });

    this.shiftTypes.fetch().catch((err) => {
      this.toastyService.error({ title: 'Error', msg: err })
    });

  }


  download(date: Date) {
    this.isDownloading = true;
    let serverPageInput: ServerPageInput = new ServerPageInput();
    serverPageInput.query['ofDate'] = date.toISOString();
    let reportName = `rosterExcel_${moment().format('DD_MMM_YY')}_DailyReport.xlsx`;
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


  ngAfterViewInit() {
    $('#dateSelector').datepicker({
      format: 'dd/mm/yyyy',
      minViewMode: 0,
      maxViewMode: 2,
      autoclose: true
    }).on('changeDate', (e) => {
      this.getEffectiveShift(e.date);
      this.getWeek(e.date);
    })
    $("#dateSelector").datepicker("setDate", new Date(new Date().setHours(0, 0, 0, 0)));
  }

  getWeek(date) {
    this.dates = [];
    var startOfWeek = moment(date).add(1, 'd');
    var endOfWeek = moment(date).add(6, 'd');
    while (startOfWeek <= endOfWeek) {
      this.dates.push(startOfWeek.toDate());
      startOfWeek = startOfWeek.clone().add(1, 'd');
    }
  }

  getEffectiveShift(date: Date) {
    this.isLoading = true;
    this.effectiveShifts.filters.properties['fromDate']['value'] = date;
    this.effectiveShifts.fetch().then(() => {
      this.isLoading = false;
    }).catch(err => this.toastyService.error({ title: 'Error', msg: err }));
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

  updateEffectiveShift(id, model: any) {
    this.isLoading = true;
    this.amsEffectiveShiftService.effectiveShifts.update(id, model)
      .then(() => {
        this.isLoading = false;
      })
      .catch(err => { this.toastyService.error({ title: 'Error', msg: err }) });
  }

  ngOnInit() {

  }

}
