import { Component, OnInit, Input } from '@angular/core';
import { AmsEmployeeService, AmsDeviceService } from '../../../services';
import { Employee, Device, Category } from '../../../models';
import { Page } from '../../../common/contracts/page';
import { Model } from '../../../common/contracts/model';
import { GenericApi } from '../../../common/generic-api';
import { Http } from '@angular/http';
import { IApi } from '../../../common/contracts/api';
import { ToastyService } from 'ng2-toasty';
import { Biometric } from '../../../models/biometric.model';
import { ServerPageInput } from '../../../common/contracts/api/page-input';

@Component({
  selector: 'aqua-finger-print',
  templateUrl: './finger-print.component.html',
  styleUrls: ['./finger-print.component.css']
})
export class FingerPrintComponent implements OnInit {
  @Input() code: string;
  @Input() employee: Employee

  isLoading = false;
  biometrics: Biometric[] = [];
  canEnable = false;

  constructor(
    private amsEmployeeService: AmsEmployeeService,
    private amsDeviceService: AmsDeviceService,
    private http: Http,
    private toastyService: ToastyService
  ) {

  }

  ngOnInit() {

  }

  ngOnChanges() {
    if (this.employee) {
      this.getAmsDetails();
    }
  }

  getWipFingerPrint(employee: Employee) {
    return employee.fingerPrints.find(item => {
      return item === 'wip';
    });
  }

  mark(biometric: Biometric, status: string) {
    const oldStatus = biometric.status
    biometric.status = status
    this.isLoading = true;
    const promise = biometric.id ?
      this.amsDeviceService.biometrics.update(biometric.id, biometric) :
      this.amsDeviceService.biometrics.create(biometric);
    promise.then(() => {
      this.isLoading = false;
      if (status !== 'deleted') {
        this.canEnable = true;
      } else {
        let canEnable = false

        this.biometrics.forEach(item => {
          switch (item.status) {
            case 'disabled':
            case 'enabled':
            case 'fetching':
              canEnable = true;
              break;
          }
        });
        this.canEnable = canEnable;
      }
    }).catch(err => {
      this.isLoading = false;
      biometric.status = oldStatus
      this.toastyService.error(err);
    });

  }

  getAmsDetails() {
    this.biometrics = [];

    const fingerPrintFilters = new ServerPageInput();
    fingerPrintFilters.query = { userId: this.employee.id };
    const deviceFilters = new ServerPageInput();
    deviceFilters.query = { category: 'biometric' };

    this.amsDeviceService.devices.search(deviceFilters).then(devicePage => {
      this.amsDeviceService.biometrics.search(fingerPrintFilters).then(page => {
        const fingerPrints = page.items;
        devicePage.items.forEach(device => {
          let fingerPrint = fingerPrints.find(item => item.device.id === device.id);
          if (fingerPrint) {
            switch (fingerPrint.status) {
              case 'disabled':
              case 'enabled':
              case 'fetching':
                this.canEnable = true;
                break;
            }
          }
          if (!fingerPrint) {
            fingerPrint = new Biometric();
            fingerPrint.device = device;
            fingerPrint.code = this.employee.code;
            fingerPrint.user = this.employee
          }

          this.biometrics.push(fingerPrint)
        });
      });
    });
  }

  setBiometricCode($event) {
    const oldValue = this.employee.biometricCode;
    this.employee.biometricCode = $event.target.value;
    this.isLoading = true;
    this.amsEmployeeService.employees.update(this.employee.id, this.employee).then(() => {
      this.isLoading = false;
      this.toastyService.success(`${this.employee.biometricCode} is now biometric code of employee ${this.employee.name}`);
    }).catch(err => {
      this.isLoading = false;
      this.toastyService.error(err);
      this.employee.biometricCode = oldValue;
    })
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
    // this.updatedEmployee = new GenericApi<Employee>(
    //   `employees/${this.employee.id}/fingerPrint?operation=${action}`,
    //   this.http,
    //   'ams'
    // );

    // if (action === 'fetch') {
    //   this.fingerPrint = 'wip';
    // }
    // if (addFinger) {
    //   model.fingerPrint = this.fingerPrint;
    // }

    // model.device = device;
    // this.updatedEmployee
    //   .all('post', null, model)
    //   .then((employee: any) => {
    //     this.isLoading = false;
    //     this.employee = employee;
    //     if (!this.employee.fingerPrints.length) {
    //       this.isFingerPrintExists = false;
    //     } else {
    //       this.isFingerPrintExists = true;
    //       // this.fingerPrint = this.getWipFingerPrint(this.employee);
    //     }
    //     if (isExist) {
    //       this.toastyService.success('FingerPrint Removed Successfully');
    //     } else {
    //       this.toastyService.success('FingerPrint Added Successfully');
    //     }
    //   })
    //   .catch(err => {
    //     this.isLoading = false;
    //     if (isExist) {
    //       this.toastyService.error(err);
    //     } else {
    //       this.toastyService.error(err);
    //     }
    //   });
  }
}
