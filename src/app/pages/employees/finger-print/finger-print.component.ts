import { Component, OnInit, Input } from '@angular/core';
import { AmsEmployeeService, AmsDeviceService } from '../../../services';
import { Employee, Device, Category } from '../../../models';
import { Page } from '../../../common/contracts/page';
import { Model } from '../../../common/contracts/model';
import { GenericApi } from '../../../common/generic-api';
import { Http } from '@angular/http';
import { IApi } from '../../../common/contracts/api';
import { ToastyService } from 'ng2-toasty';

@Component({
  selector: 'aqua-finger-print',
  templateUrl: './finger-print.component.html',
  styleUrls: ['./finger-print.component.css']
})
export class FingerPrintComponent implements OnInit {
  @Input() code: string;
  employee: Employee = new Employee();
  devices: Page<Device>;
  device: Model<Device>;
  updatedEmployee: IApi<Employee>;
  isFingerPrintExists = false;
  isLoading = false;
  fingerPrint: string;

  constructor(
    private amsEmployeeService: AmsEmployeeService,
    private amsDeviceService: AmsDeviceService,
    private http: Http,
    private toastyService: ToastyService
  ) {
    this.devices = new Page({
      api: amsDeviceService.devices,
      filters: [
        {
          field: 'category',
          value: null
        }
      ]
    });
  }

  ngOnInit() { }

  ngOnChanges() {
    if (this.code) {
      this.getAmsDetails();
    }
  }

  getWipFingerPrint(employee: Employee) {
    return employee.fingerPrints.find(item => {
      return item === 'wip';
    });
  }

  getAmsDetails() {
    this.isLoading = true;
    this.amsEmployeeService.employees
      .get(this.code)
      .then(amsEmployee => {
        this.isLoading = false;
        this.employee = amsEmployee;
        if (this.employee.fingerPrints && this.employee.fingerPrints.length) {
          this.isFingerPrintExists = true;
          this.fingerPrint = this.getWipFingerPrint(this.employee);
        }
        this.devices.filters.properties['category'].value = 'biometric';
        this.devices.fetch();
      })
      .catch(err => {
        this.isLoading = false;
        console.error(err);
      });
  }

  isExists(device) {
    const deviceExits: any = this.employee.devices.find(item => {
      return item.id === device;
    });
    if (deviceExits && deviceExits.status !== 'disable') {
      return true;
    }
    return false;
  }

  updateFingerPrint(isExist, addFinger, action, device) {
    const model: any = {
      device: ''
    };
    this.isLoading = true;
    this.updatedEmployee = new GenericApi<Employee>(
      `employees/${this.employee.id}/fingerPrint?operation=${action}`,
      this.http,
      'ams'
    );

    if (action === 'fetch') {
      this.fingerPrint = 'wip';
    }
    if (addFinger) {
      model.fingerPrint = this.fingerPrint;
    }

    model.device = device;
    this.updatedEmployee
      .all('post', null, model)
      .then((employee: any) => {
        this.isLoading = false;
        this.employee = employee;
        if (!this.employee.fingerPrints.length) {
          this.isFingerPrintExists = false;
        } else {
          this.isFingerPrintExists = true;
          this.fingerPrint = this.getWipFingerPrint(this.employee);
        }
        if (isExist) {
          this.toastyService.success('FingerPrint Removed Succesfully');
        } else {
          this.toastyService.success('FingerPrint Added Successfully');
        }
      })
      .catch(err => {
        this.isLoading = false;
        if (isExist) {
          this.toastyService.error(err);
        } else {
          this.toastyService.error(err);
        }
      });
  }
}
