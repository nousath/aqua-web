import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { AmsEmployeeService, AmsDeviceService, AmsSystemUsageService } from '../../../services';
import { Employee, Device, Category } from '../../../models';
import { Http } from '@angular/http';
import { PageOptions } from '../../../common/ng-api';
import { ToastyService } from 'ng2-toasty';
import { Biometric } from '../../../models/biometric.model';
import { Task } from '../../../models/task.model';

@Component({
  selector: 'aqua-finger-print',
  templateUrl: './finger-print.component.html',
  styleUrls: ['./finger-print.component.css']
})
export class FingerPrintComponent implements OnInit, OnChanges {
  @Input()
  code: string;
  @Input()
  employee: Employee

  isLoading = false;
  biometrics: Biometric[] = [];
  canEnable = false;

  hasPendingTasks = true;

  pendingTasks: Task[] = [];

  constructor(
    private amsEmployeeService: AmsEmployeeService,
    private amsDeviceService: AmsDeviceService,
    private systemService: AmsSystemUsageService,
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

  checkPendingTasks() {
    const ids = this.biometrics.map(i => i.id)

    this.systemService.tasks.search(new PageOptions({
      query: { biometricIds: ids, deviceId: 'any' }
    })).then((page) => {
      if (page.items && page.items.length) {
        this.hasPendingTasks = true;
        setTimeout(() => { this.checkPendingTasks() }, 5000)
      } else {
        this.hasPendingTasks = false;
      }
    })
  }

  mark(biometric: Biometric, status: string) {

    const oldStatus = biometric.status
    biometric.status = status
    this.isLoading = true;
    const promise = biometric.id ?
      this.amsDeviceService.biometrics.update(biometric.id, biometric) :
      this.amsDeviceService.biometrics.create(biometric);
    promise.then((updated) => {
      this.isLoading = false;
      biometric.id = updated.id;
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
      // this.checkPendingTasks()
    }).catch(err => {
      this.isLoading = false;
      biometric.status = oldStatus
      this.toastyService.error(err);
    });

  }

  getAmsDetails() {
    this.biometrics = [];

    const fingerPrintFilters = new PageOptions();
    fingerPrintFilters.query = { userId: this.employee.id };
    const deviceFilters = new PageOptions();
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
            fingerPrint.code = this.employee.biometricCode;
            fingerPrint.user = this.employee
          }

          this.biometrics.push(fingerPrint)

        });

        // this.checkPendingTasks();
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
