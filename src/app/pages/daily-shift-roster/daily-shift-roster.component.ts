import { Component, OnInit } from '@angular/core';
import { Page } from '../../common/contracts/page';
import { Model } from '../../common/contracts/model';
import { Router, ActivatedRoute } from '@angular/router';
import { AutoCompleteService } from '../../services/auto-complete.service';
import { Observable, Subscription } from 'rxjs/Rx';
import { AmsEmployeeService } from '../../services/ams/ams-employee.service';
import { ToastyService } from 'ng2-toasty';
import { ShiftType } from '../../models/shift-type';
import { EffectiveShift } from '../../models/effective-shift';
import { AmsEffectiveShiftService } from '../../services/ams/ams-effective-shift.service';
import { AmsShiftService } from '../../services/ams/ams-shift.service';
import { LocalStorageService } from '../../services/local-storage.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Employee } from '../../models/employee';
declare var $: any;

@Component({
  selector: 'aqua-daily-shift-roster',
  templateUrl: './daily-shift-roster.component.html',
  styleUrls: ['./daily-shift-roster.component.css']
})
export class DailyShiftRosterComponent implements OnInit {
  shiftTypes: Page<ShiftType>;
  effectiveShifts: Page<EffectiveShift>;
  effectiveShift: any;  
  isLoading = true;
  date: Date;
  throttle = 300;
  scrollDistance = 1;
  scrollUpDistance = 2; 
  pageSize = 10;
  isSpinnerDown: boolean = false;
  subscription: Subscription;

  constructor(private activatedRoute: ActivatedRoute,
    private autoCompleteService: AutoCompleteService,
    private amsShiftService: AmsShiftService,
    private store: LocalStorageService,
    private amsEmployeeService: AmsEmployeeService,
    private amsEffectiveShiftService: AmsEffectiveShiftService,
    private router: Router,
    private toastyService: ToastyService) {

      this.subscription = activatedRoute.queryParams.subscribe(queryParams => {
        let token: string = queryParams['token'];
        let orgCode: string = queryParams['orgCode'];
        let isHeader: string = queryParams['isHeader'];
        if (token && orgCode) {
          orgCode = orgCode.toLowerCase();
          this.store.setItem('ams_token', token);
          this.store.setItem('orgCode', orgCode);
        }
      })
  

    this.shiftTypes = new Page({
      api: amsShiftService.shiftTypes
    });

    this.effectiveShifts = new Page({
      api: amsEffectiveShiftService.effectiveShifts,
      filters: [{
        field: 'fromDate',
        value: null
      },
      {
        field: 'toDate',
        value: null
      }, {
        field: 'pageSize',
        value: 1
      }]
    });
   


    this.shiftTypes.fetch().catch((err) => {
      this.toastyService.error({ title: 'Error', msg: err })
    });

    $("#dateSelector").datepicker("setDate", new Date());
  }

  onScrollDown() {
    console.log('scrolled down!!');   
    this.isSpinnerDown = true;   
    this.pageSize += 10;
    this.getEffectiveShift(this.date, this.pageSize)
  }

  onUp() {
    console.log('scrolled up!');
  }

  getEffectiveShift(date: Date, pageSize) {
    this.isLoading = true;
    this.effectiveShifts.filters.properties['fromDate']['value'] = moment(date);
    this.effectiveShifts.filters.properties['toDate']['value'] = moment(date).add(1, 'day');
    this.effectiveShifts.filters.properties['pageSize']['value'] = pageSize;
    this.effectiveShifts.fetch().then(() => {
      this.isLoading = false;
      this.isSpinnerDown = false;
    }).catch(err => this.toastyService.error({ title: 'Error', msg: err }));
  }

  changeShift(shiftType, date, employee) {
    if (!shiftType)
      return this.toastyService.info({ title: 'Info', msg: 'Please select Shift' });

    if (!date)
      return this.toastyService.info({ title: 'Info', msg: 'Please select Date' });

    if (date <= new Date())
      return this.toastyService.info({ title: 'Info', msg: 'Please select date greater than today' })

    let model: any = {};
    model = {
      date: date,
      newShiftType: shiftType.id
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

  // onSelectEmp(emp: Employee) {  //todo
  //    this.effectiveShift = _.find(this.effectiveShifts.items, function(item) {
  //      if(item.employee.id == emp.id )
  //       return item
  //      }
  //   )
  //    console.log(this.effectiveShift);

  //     // this.router.navigate(['pages/attendances/daily', emp.id]);
  //     // this.selectedEmp = new Employee();
  // }

  // empSource(keyword: string): Observable<Employee[]> {  //todo
  //   return this.autoCompleteService.searchByKey<Employee>('name', keyword, 'ams', 'employees');
  // }

  // empFormatter(data: Employee): string {  //todo
  //   return data.name;
  // }

  // empListFormatter(data: Employee): string {   //todo
  //   return `${data.name} (${data.code})`;
  // }

 
  ngAfterViewInit() {
    $('#dateSelector').datepicker({
      format: 'dd/MM/yyyy',
      minViewMode: 0,
      maxViewMode: 2,
      autoclose: true,
      maxDate: new Date()
    }).on('changeDate', (e) => {
      this.date = e.date;
      this.getEffectiveShift(e.date, 10);
    });
    $("#dateSelector").datepicker("setDate", new Date());
  }

  ngOnInit() {
  }

}
