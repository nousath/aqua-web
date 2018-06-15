import { Component, OnInit } from '@angular/core';
import { Holiday } from '../../../models';
import { Page } from '../../../common/contracts/page';
import { AmsHolidayService, ValidatorService } from '../../../services';
import { ToastyService } from 'ng2-toasty';
import * as moment from 'moment';
import { Model } from '../../../common/contracts/model';
import { FileUploader } from 'ng2-file-upload';
declare var $: any;

@Component({
  selector: 'aqua-holidays',
  templateUrl: './holidays.component.html',
  styleUrls: ['./holidays.component.css']
})
export class HolidaysComponent implements OnInit {

  holidays: Page<Holiday>
  holiday: Model<Holiday>
  isFilter: boolean = false;
  uploader: FileUploader;
  isNew: boolean = false;
  upcoming: boolean = true;
  currentDate: any;
  isUpload: boolean = false;


  constructor(private amsHolidayService: AmsHolidayService,
    public validatorService: ValidatorService,
    private toastyService: ToastyService) {

    this.holidays = new Page({
      api: amsHolidayService.holidays,
      filters:[{
        field: 'date',
        value: null
      }]
    });

    this.holiday = new Model({
      api: amsHolidayService.holidays,
      properties: new Holiday()
    });
    this.currentDate = new Date().toISOString();
    // moment(this.currentDate).utc;
    // this.currentDate.toUTCString();
    console.log(this.currentDate)

    this.fetchHolidays();
  }

  excel() {
    this.isUpload = !this.isUpload;
  }

  upcomingHoliday(holiday:any){
    return moment(moment(holiday.date).startOf('day')).isAfter(moment(this.currentDate).startOf('day'))
  }
  fetchHolidays() {
    
    this.holidays.fetch().catch(err => this.toastyService.error({ title: 'Error', msg: err }));
  }
  Upcoming(){
    this.upcoming = false
    this.holidays.filters.properties['date'].value = new Date().toISOString();
    this.holidays.fetch().catch(err => this.toastyService.error({ title: 'Error', msg: err }));
  }

  toggleHoliday(isOpen?: boolean) {
    this.isNew = isOpen ? true : false;
    this.holiday.properties = new Holiday();
    setTimeout(() => {
      this.initDatePiker();
    }, 1000);
  }

  saveHoliday() {
    if (!this.holiday.properties.name)
      return this.toastyService.info({ title: 'Info', msg: 'Enter Holiday Name' });
    if (!this.holiday.properties.date)
      return this.toastyService.info({ title: 'Info', msg: 'Select  Date' });
    this.holiday.properties.date = new Date(this.holiday.properties.date).toISOString();
    this.holiday.save().then(data => {
      this.toggleHoliday();
      this.fetchHolidays()
    }).catch(err => this.toastyService.error({ title: 'Error', msg: err }));
  }

  initDatePiker() {
    $('#dateSelector').datepicker({
      format: 'dd/mm/yyyy',
      minViewMode: 0,
      maxViewMode: 2,
      autoclose: true
    }).on('changeDate', (e) => {
      this.holiday.properties.date = new Date(e.date).toISOString();
    });
  }
  AllHolidays(){
    this.upcoming = true
    this.holidays.filters.properties['date'].value = null;
    this.holidays.fetch().catch(err => this.toastyService.error({ title: 'Error', msg: err }));
  }
  ngOnInit() {
  }

}
