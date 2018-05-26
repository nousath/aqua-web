import { Component, OnInit, Input } from "@angular/core";
import { AmsEmployeeService, AmsDeviceService } from "../../../services";
import { Employee, Device, Category } from "../../../models";
import { Page } from "../../../common/contracts/page";
import { Model } from "../../../common/contracts/model";
import { GenericApi } from "../../../common/generic-api";
import { Http } from "@angular/http";
import { IApi } from "../../../common/contracts/api";
import { ToastyService } from "ng2-toasty";

@Component({
  selector: "aqua-finger-print",
  templateUrl: "./finger-print.component.html",
  styleUrls: ["./finger-print.component.css"]
})
export class FingerPrintComponent implements OnInit {
  @Input() code: string;
  employee: Employee = new Employee();
  devices: Page<Device>;
  device: Model<Device>;
  updatedEmployee: IApi<Employee>;
  isFingerPrintExists: boolean = false;
  isLoading: boolean = false;
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
          field: "category",
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

    // if(this.employee && this.employee.fingerPrint.toLowerCase() === 'wip'){
    //   this.toastyService.info('finger print added')
    // }
  }

  getAmsDetails() {
    this.isLoading = true;
    this.amsEmployeeService.employees
      .get(this.code)
      .then(amsEmployee => {
        this.isLoading = false;
        this.employee = amsEmployee;
        if (this.employee.fingerPrint) {
          this.isFingerPrintExists = true;
          this.fingerPrint = this.employee.fingerPrint
        }
        this.devices.filters.properties["category"].value = "biometric";
        this.devices.fetch();
      })
      .catch(err => {
        this.isLoading = false;
        console.error(err);
      });
  }
  isExists(device) {
    let deviceExits = this.employee.devices.find(item => {
      return item === device;
    });
    if (deviceExits) {
      return true;
    }
    return false;
  }
  updateFingerPrint(isExist, addFinger, action, device) {
    const model: any = {
      device: ''
    };
    this.isLoading = true;
    // if (isExist) {
    //   this.employee.devices = this.employee.devices.filter(item => {
    //     return item !== device;
    //   });
    // } else {
    //   this.employee.devices.push(device);
    // }

    this.updatedEmployee = new GenericApi<Employee>(
      `employees/${this.employee.id}/fingerPrint?operation=${action}`,
      this.http,
      "ams"
    );

    if (addFinger) {
      model.fingerPrint = this.fingerPrint;
    }

    model.device = device;
    this.updatedEmployee
      .all("post", null, model)
      .then((employee: any) => {
        this.isLoading = false;
        this.employee = employee;
        if (!this.employee.fingerPrint) {
          this.isFingerPrintExists = false;
        } else {
          this.isFingerPrintExists = true;
          this.fingerPrint = this.employee.fingerPrint
        }
        if (isExist) {
          this.toastyService.success("FingerPrint Removed Succesfully");
        } else {
          this.toastyService.success("FingerPrint Added Successfully");
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