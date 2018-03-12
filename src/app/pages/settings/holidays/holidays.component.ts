import { Holiday } from './../../../models/holiday';
import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Page } from '../../../common/contracts/page';
import { AmsHolidayService, ValidatorService } from '../../../services';
import { ToastyService } from 'ng2-toasty';
import { Model } from '../../../common/contracts/model';
import { LocalStorageService } from '../../../services/local-storage.service';
import { _def } from '@angular/core/src/view/provider';
declare var $: any;

@Component({
  selector: 'aqua-holidays',
  templateUrl: './holidays.component.html',
  styleUrls: ['./holidays.component.css']
})
export class HolidaysComponent implements OnInit {

  holidays: Page<Holiday>
  holiday: Model<Holiday>
  isFilter = false;
  isNew = false;

  constructor(private amsHolidayService: AmsHolidayService,
    public validatorService: ValidatorService,
    private store: LocalStorageService,
    private toastyService: ToastyService) {

    this.holidays = new Page({
      api: amsHolidayService.holidays
    });

    this.holiday = new Model({
      api: amsHolidayService.holidays,
      properties: new Holiday()
    });

    this.fetchHolidays();
  }

  // fetchHolidays() {
  //   this.holidays.fetch().catch(err => this.toastyService.error({ title: 'Error', msg: err }));
  // }
  fetchHolidays() {
    this.holidays.fetch().then(
      data => {
        _.each(this.holidays.items, (item: Holiday) => {
          item['isEdit'] = false
        })
      }
    ).catch(err => this.toastyService.error({ title: 'Error', msg: err }));
  }

  toggleHoliday(isOpen?: boolean) {
    this.isNew = isOpen ? true : false;
    this.holiday.properties = new Holiday();
    setTimeout(() => {
      this.initDatePiker();
    }, 1000);
  }

  save(holiday?:Holiday) {
    if(holiday){
      this.holiday.properties = holiday;
    }
    if (!this.holiday.properties.name)
      return this.toastyService.info({ title: 'Info', msg: 'Enter Holiday Name' });
    // if (!this.holiday.properties.date)
    //   return this.toastyService.info({ title: 'Info', msg: 'Select  Date' });
    // this.holiday.properties.date = new Date(this.holiday.properties.date).toISOString();
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
  edit(holiday: Holiday, isEdit: boolean) {
    if (isEdit) {
      holiday.isEdit = true;
      this.store.setObject(`holidayEdit_${holiday.id}`, holiday);
    } else {
      holiday.isEdit = false;
      const d: Holiday = this.store.getObject(`holidayEdit_${holiday.id}`) as Holiday;
      holiday.code = d.code;
      holiday.name = d.name;
      this.store.removeItem(`holidayEdit_${holiday.id}`);
    }
  }
  // save(holiday?: Holiday) {
  //   if (holiday) {
  //     this.holiday.properties = holiday;
  //   }
  //   if (!this.holiday.properties.name)
  //     return this.toastyService.info({ title: 'Info', msg: 'Enter  Name' });
  //   if (!this.holiday.properties.date)
  //     return this.toastyService.info({ title: 'Info', msg: 'Select  Code' });
  //   this.holiday.save().then(data => {
  //     if (holiday) {
  //       holiday.isEdit = false;
  //       this.store.removeItem(`holidayEdit_${holiday.id}`);
  //     } else {
  //       // this.toggleDesignation();
  //     }
  //     this.fetchHolidays()
  //   }).catch(err => this.toastyService.error({ title: 'Error', msg: err }));
  // }

  
  

  ngOnInit() {
  }
  
  remove(item) {
    this.holiday.properties = item;
    this.holiday.remove()
      .then(() => {
        this.toastyService.info({ title: 'Info', msg: 'holidays successfully delete' })
      })
      .catch(err => this.toastyService.error({ title: 'Error', msg: err }));
  }
}


