import { Component, OnInit } from '@angular/core';
import { Model } from '../../../common/contracts/model';
import { Employee } from '../../../models/employee';
import { ToastyService } from 'ng2-toasty';
import { Page } from '../../../common/contracts/page';
import { AmsEmployeeService } from '../../../services/ams/ams-employee.service';
import { ShiftType } from '../../../models/shift-type';
import * as _ from 'lodash';
import { AmsShiftService } from '../../../services/ams/ams-shift.service';
import { ValidatorService } from '../../../services/validator.service';
import * as moment from 'moment';

@Component({
  selector: 'aqua-shift-change',
  templateUrl: './shift-change.component.html',
  styleUrls: ['./shift-change.component.css']
})
export class ShiftChangeComponent implements OnInit {

  employees: Page<Employee>
  employee: Model<Employee>
  shifTypes: Page<ShiftType>
  shiftChangeType: 'now' | 'later' = 'now';

  constructor(private amsEmployeeService: AmsEmployeeService,
    public validatorService: ValidatorService,
    private amsShiftService: AmsShiftService,
    private toastyService: ToastyService) {
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

    this.shifTypes.fetch().catch(err => this.toastyService.error({ title: 'Error', msg: err }));
    this.fetchEmp();
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



  changeShift(emp: Employee, shiftTypeId: string, date?: Date) {

    if (!shiftTypeId)
      return this.toastyService.info({ title: 'Info', msg: 'Please select Shift' });

    let model: any = {}

    if (emp.shiftType.changeType == 'now') {
      model = {
        shiftType: { id: shiftTypeId }
      }
    }
    if (emp.shiftType.changeType == 'later') {
      if (!date)
        return this.toastyService.info({ title: 'Info', msg: 'Please select date in case of later' });
      if (moment(date).startOf('day') <= moment().startOf('day'))
        return this.toastyService.info({ title: 'Info', msg: 'Date should be greater than current date' });
      model = {
        shiftType: shiftTypeId,
        date: new Date(date).toISOString()
      }
    }
    this.updateEmp(emp.id, model);
  }

  updateEmp(id, model: any) {
    this.employee.isProcessing = true;
    this.amsEmployeeService.employees.update(id, model)
      .then(data => {
        this.employee.isProcessing = false;
      })
      .catch(err => { this.employee.isProcessing = false; this.toastyService.error({ title: 'Error', msg: err }) });
  }

  ngOnInit() {
  }

}
