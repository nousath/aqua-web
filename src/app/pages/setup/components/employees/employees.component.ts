import { Component, OnInit } from '@angular/core';
import { Model } from '../../../../common/contracts/model';
import { Page } from '../../../../common/contracts/page';
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { ValidatorService, AmsOrganizationService, EmsEmployeeService } from '../../../../services';
import { ToastyService } from 'ng2-toasty';
import { PushEventService } from '../../../../services/push-event.service';
import { Angulartics2 } from 'angulartics2';
import { LocalStorageService } from '../../../../services/local-storage.service';
import { CurrentPage, EmsEmployee } from '../../../../models';
// import { ValidatorService } from '../../services/validator.service';
// import { EmsEmployeeService } from '../../services/ems/ems-employee.service';
// import { EmsEmployee } from '../../models/ems/employee';
// import { Model } from '../../common/contracts/model';
// import { ToastyService } from 'ng2-toasty';
// import { Page } from '../../common/contracts/page';
// import { FileUploader, FileItem, ParsedResponseHeaders } from "ng2-file-upload";
// import { CoolLocalStorage } from 'angular2-cool-storage';
// import { PushEventService } from '../../services/push-event.service';
// import { CurrentPage } from '../../models/push-events';
// import { AmsOrganizationService } from '../../services/ams/ams-organization.service';
// import { Angulartics2 } from 'angulartics2';

@Component({
  selector: 'ams-gs-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {

  section: 'main' | 'excel' | 'edualaya' = 'main';

  employee: Model<EmsEmployee>;
  employees: Page<EmsEmployee>;
  uploader: FileUploader;

  dummyEmps: Array<EmsEmployee> = [
    new EmsEmployee(),
    new EmsEmployee(),
    new EmsEmployee()
  ]


  constructor(public validatorService: ValidatorService,
    private toastyService: ToastyService,
    private store: LocalStorageService,
    private amsOrganizationService: AmsOrganizationService,
    private emsEmployeeService: EmsEmployeeService,
    private pushEventService: PushEventService,
    private angulartics2: Angulartics2) {

    const page: CurrentPage = new CurrentPage();
    page.header = 'Create Team';
    page.description = 'You can add employees manually and can also import Excels';
    page.nextUrl = '/pages/wizard/devices';
    page.page = 'employees';
    page.onBoardingStatus = 'employees';
    pushEventService.pushPage(page);

    const access_Token: string = this.store.getItem('external-token');
    const orgCode = this.store.getItem('orgCode');
    this.uploader = new FileUploader({
      url: '/ems/api/employees/importer',
      itemAlias: 'file',
      allowedMimeType: [
        'application/vnd.ms-excel',
        'application/vnd.ms-excel',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.template',
        'application/vnd.ms-excel.sheet.macroEnabled.12',
        'application/vnd.ms-excel.template.macroEnabled.12',
        'application/vnd.ms-excel.addin.macroEnabled.12',
        'application/vnd.ms-excel.sheet.binary.macroEnabled.12'
      ],
      headers: [{
        name: 'x-access-token',
        value: access_Token
      }, {
        name: 'org-code',
        value: orgCode
      }]
    });

    this.uploader.onAfterAddingAll = (fileItems: FileItem) => {
      if (this.uploader.queue.length > 1)
        this.uploader.removeFromQueue(this.uploader.queue[0]);

    };

    this.uploader.onErrorItem = (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
      this.uploader.clearQueue();
      // document.getElementById('uploader')['value'] = null;
    };

    this.uploader.onCompleteItem = (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
      const res: any = JSON.parse(response);
      if (!res.isSuccess) {
        // document.getElementById('uploader')['value'] = null;
        this.uploader.clearQueue();
        return toastyService.error({ title: 'Error', msg: res.error || 'excel upload failed' });
      }
      this.fetchEmp();
      this.section = 'main';
    };

    this.employee = new Model({
      api: emsEmployeeService.employees,
      properties: new EmsEmployee()
    });

    this.employees = new Page({
      api: emsEmployeeService.employees,
      filters: [{
        field: 'name',
        value: null
      }, {
        field: 'status',
        value: 'activate'
      }]
    });
    this.employees.pageSize = 5;
    this.fetchEmp();
  }

  next() {
    this.amsOrganizationService.nextStep('employees', '/pages/wizard/devices');
    this.angulartics2.eventTrack.next({ action: 'proceedClick', properties: { category: 'wizardEmployeesTeam' } });
  }

  fetchEmp(status?: string) {
    this.employees.filters.properties['status'].value = status ? status : 'activate';
    this.employees.fetch().then(
      data => {
        const l: number = this.employees.items.length;
        if (l && l <= 3) {
          this.dummyEmps.splice(0, l - 1);
        } else {
          this.dummyEmps = [];
        }
      }
    ).catch(err => this.toastyService.error({ title: 'Error', msg: err }));

  }

  addRow() {
    if (this.dummyEmps.length === 0)
      this.dummyEmps.push(new EmsEmployee());
    this.angulartics2.eventTrack.next({ action: 'addRowClick', properties: { category: 'wizardEmployeesTeam' } });
  }

  addEmp(emp: EmsEmployee, index: number) {

    if (!emp.profile.firstName)
      return this.toastyService.info({ title: 'Error', msg: 'Please enter employee First Name' });
    if (!emp.code)
      return this.toastyService.info({ title: 'Error', msg: 'Please enter employee Code' });
    // if (!emp.email)
    //   return this.toastyService.info({ title: 'Error', msg: 'Please enter employee Email' });
    if (emp.email && !this.validatorService.validateEmail(emp.email)) {
      return this.toastyService.info({ title: 'Info', msg: 'Please enter a Valid Email' })
    }
    this.employee.properties = emp;
    this.employee.properties.status = 'activate';

    this.employee.save().then(
      data => {
        this.employee.properties = new EmsEmployee();
        this.fetchEmp();
        this.toastyService.success({ title: 'Success', msg: `${this.employee.properties.profile.firstName} added successfully` });
      }
    ).catch(err => this.toastyService.error({ title: 'Error', msg: err }));
  }

  switchSectrion(section: 'main' | 'excel' | 'edualaya') {
    this.section = section;
    this.uploader.clearQueue();
    this.angulartics2.eventTrack.next({ action: 'importExcelClick', properties: { category: 'wizardEmployeesTeam' } });
  }

  ngOnInit() {
  }


}
