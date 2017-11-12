import { Component, OnInit, OnDestroy } from '@angular/core';
import { Model } from '../../../common/contracts/model';
import { Employee, EffectiveShift } from '../../../models/employee';
import { ToastyService } from 'ng2-toasty';
import { Page } from '../../../common/contracts/page';
import { AmsEmployeeService } from '../../../services/ams/ams-employee.service';
import { ShiftType } from '../../../models/shift-type';
import * as _ from 'lodash';
import { AmsShiftService } from '../../../services/ams/ams-shift.service';
import { ValidatorService } from '../../../services/validator.service';
import * as moment from 'moment';
import { Meta } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { LocalStorageService } from '../../../services/local-storage.service';

@Component({
  selector: 'aqua-shift-change',
  templateUrl: './shift-change.component.html',
  styleUrls: ['./shift-change.component.css']
})
export class ShiftChangeComponent implements OnInit, OnDestroy {

  employees: Page<Employee>
  employee: Model<Employee>
  shifTypes: Page<ShiftType>
  shiftChangeType: 'now' | 'later' = 'now';
  subscription: Subscription;

  constructor(private amsEmployeeService: AmsEmployeeService,
    public validatorService: ValidatorService,
    private amsShiftService: AmsShiftService,
    private toastyService: ToastyService,
    private activatedRoute: ActivatedRoute,
    private store: LocalStorageService,
    private meta: Meta) {

    this.subscription = activatedRoute.queryParams.subscribe(
      queryParams => {
        let token = queryParams['amsToken'];
        let orgCode = queryParams['orgCode'];
        if (token && orgCode) {
          this.meta.addTag({ name: 'viewport', content: 'width=device-width, initial-scale=1' }, true);
          store.setItem('ams_token', token);
          store.setItem('orgCode', orgCode);
        }
      }
    );
    // this.meta.addTag({ name: 'viewport', content: 'width=400' }, true);
    this.employees = new Page({
      api: amsEmployeeService.employees,
      filters: [{
        field: 'name',
        value: null
      }]
    });

    this.employee = new Model({
      api: amsEmployeeService.employees,
      properties: new Employee()
    });

    this.shifTypes = new Page({
      api: amsShiftService.shiftTypes
    });

    this.shifTypes.fetch().then(
      data => {
        this.fetchEmp();

      }
    ).catch(err => this.toastyService.error({ title: 'Error', msg: err }));
  }

  fetchEmp() {
    this.employees.fetch().then(() => {
      _.each(this.employees.items, (item: Employee) => {
        if (!item.shiftType)
          item.shiftType = new ShiftType();
        item.shiftType['changeType'] = 'now';
      })
    }).catch(err => this.toastyService.error({ title: 'Error', msg: err }));
  }


  checkDate(effectiveShift: EffectiveShift): boolean {
    if (!effectiveShift || !effectiveShift.date)
      return false;
    return moment(effectiveShift.date).isAfter(moment(), 'day')
  }

  getShidtName(effectiveShift: EffectiveShift): string {
    if (!effectiveShift || !effectiveShift.shiftType)
      return '';
    let shiftType: ShiftType = _.find(this.shifTypes.items, (i: ShiftType) => {
      return i.id == effectiveShift.shiftType
    });

    return shiftType ? shiftType.name : '';


  }

  changeShift(emp: Employee, shiftTypeId: HTMLSelectElement, date?: HTMLInputElement) {

    if (!shiftTypeId || shiftTypeId.value == 'null')
      return this.toastyService.info({ title: 'Info', msg: 'Please select Shift' });

    if (emp.shiftType.id == shiftTypeId.value)
      return this.toastyService.info({ title: 'Info', msg: `${emp.name} already has ${emp.shiftType.name} shift` });


    let model: any = {}

    if (emp.shiftType.changeType == 'now') {
      model = {
        shiftType: { id: shiftTypeId.value }
      }
    }
    if (emp.shiftType.changeType == 'later') {
      if (!date)
        return this.toastyService.info({ title: 'Info', msg: 'Please select date in case of later' });
      // if (moment(date.value).startOf('day') <= moment().startOf('day'))
      if (moment(date.value).startOf('day') <= moment().startOf('day'))
        return this.toastyService.info({ title: 'Info', msg: 'Date should be greater than current date' });
      model = {
        effectiveShift: {
          shiftType: shiftTypeId.value,
          date: new Date(date.value).toISOString()
        }
      }
    }
    this.updateEmp(emp.id, model);
  }

  updateEmp(id, model: any) {
    this.employee.isProcessing = true;
    this.amsEmployeeService.employees.update(id, model)
      .then(data => {
        this.employee.isProcessing = false;
        _.some(this.employees.items, (item: Employee) => {
          if (item.id == id) {
            item.effectiveShift = data.effectiveShift;
            return true;
          }
        })
      })
      .catch(err => { this.employee.isProcessing = false; this.toastyService.error({ title: 'Error', msg: err }) });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
