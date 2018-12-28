import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { EmsEmployeeService } from '../../../services/ems';
import { Employee } from '../../../models/employee';
import { Page } from '../../../common/contracts/page';
import { ToastyService } from 'ng2-toasty';
import { MdDialog, MdDialogRef } from '@angular/material';
import { Model } from '../../../common/contracts/model';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { EmsEmployee } from '../../../models/ems/employee';
import { Filter } from '../../../common/contracts/filters';
import * as _ from 'lodash';
import { ConfirmDialogComponent } from '../../../dialogs/confirm-dialog/confirm-dialog.component';
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { LocalStorageService } from 'app/services/local-storage.service';
import { ValidatorService } from '../../../services/validator.service';
import { RelievingDialogComponent } from '../../../dialogs/relieving-dialog/relieving-dialog.component';
import { FileUploaderDialogComponent } from '../../../shared/components/file-uploader-dialog/file-uploader-dialog.component';
import { EmsAuthService } from '../../../services/ems/ems-auth.service';

@Component({
  selector: 'aqua-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
  @Output()
  data: EventEmitter<any> = new EventEmitter();
  employees: Page<EmsEmployee>
  employee: Model<EmsEmployee>
  statusFilter = 'active';
  uploader: FileUploader;
  isUpload = false;
  isFilter = false;
  userDiv: any
  filterFields = [
    'name',
    'code',
    'biometricId',
    'designations',
    'departments',
    'divisions',
    'supervisor',
    'employeeTypes',
    'userTypes',
    'contractors'
  ]

  constructor(private emsEmployeeService: EmsEmployeeService,
    private toastyService: ToastyService,
    public validatorService: ValidatorService,
    private activatedRoute: ActivatedRoute,
    private store: LocalStorageService,
    private auth: EmsAuthService,
    private router: Router,
    public dialog: MdDialog) {

    const access_Token: string = this.store.getItem('external-token');
    const orgCode = this.store.getItem('orgCode');
    this.uploader = new FileUploader({
      url: '/ems/api/employees/importer',
      itemAlias: 'file',
      headers: [{
        name: 'x-access-token',
        value: access_Token
      }, {
        name: 'org-code',
        value: orgCode
      }]
    });

    this.uploader.onAfterAddingAll = (fileItems: FileItem) => {
    };

    this.uploader.onErrorItem = (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
      console.log('onErrorItem', response, headers);
    };

    this.uploader.onCompleteItem = (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {

      const res: any = JSON.parse(response);
      if (!res.isSuccess)
        return toastyService.error({ title: 'Error', msg: 'excel upload failed' })
      this.fetchEmp();
      this.isUpload = false;

    };

    const divisionFilter = {
      field: 'divisions',
      value: null
    }
    const userDiv = this.auth.currentRole().employee.division
    if (userDiv && userDiv.name && userDiv.code && userDiv.code !== 'default') {
      divisionFilter.value = [userDiv.id]
    }

    this.employees = new Page({
      api: emsEmployeeService.employees,
      filters: [
        'ofDate',
        'name',
        'code',
        'status',
        'designations',
        'departments',
        divisionFilter,
        'biometricId',
        'supervisor',
        'userTypes',
        'employeeTypes',
        'terminationReason',
        'terminationDate',
        'contractors',
      ]
    });

    this.employee = new Model({
      api: emsEmployeeService.employees,
      properties: new EmsEmployee()
    });
    this.fetchEmp();
  }

  reset() {
    setTimeout(() => {
      this.applyFilters({
        params: {}
      });
    }, 1)
  }


  applyFilters(result) {
    const filters = this.employees.filters.properties;

    const values = result.params;

    filters['name']['value'] = values.employee && values.employee.name ? values.employee.name : '';
    filters['code']['value'] = values.employee && values.employee.code ? values.employee.code : '';
    filters['biometricId']['value'] = values.employee && values.employee.biometricId ? values.employee.biometricId : '';
    filters['departments']['value'] = values.employee && values.employee.departments ? values.employee.departments.map(item => item.id) : '';
    filters['designations']['value'] = values.employee && values.employee.designations ? values.employee.designations.map(item => item.id) : '';
    filters['divisions']['value'] = values.employee && values.employee.divisions ? values.employee.divisions.map(item => item.id) : '';
    filters['supervisor']['value'] = values.employee && values.employee.supervisor ? values.employee.supervisor.id : '';
    filters['contractors']['value'] = values.employee && values.employee.contractors ? values.employee.contractors.map(item => item.id) : '';
    filters['userTypes']['value'] = values.employee && values.employee.userTypes ? values.employee.userTypes.map(item => item.name) : '';
    filters['employeeTypes']['value'] = values.employee && values.employee.employeeTypes ? values.employee.employeeTypes.map(item => item.code) : '';
    filters['terminationReason']['value'] = values.employee && values.employee.terminationReason ? values.employee.terminationReason.map(item => item.code) : '';
    filters['terminationDate']['value'] = values.dates && values.dates.terminationDate ? values.dates.terminationDate : '';
    this.fetchEmp();
  }

  fetchByStatus() {
    this.employees.filters.properties['status'].value = this.statusFilter ? this.statusFilter : 'active';
    switch (this.statusFilter) {
      case 'active':
        this.filterFields = [
          'name',
          'code',
          'biometricId',
          'designations',
          'departments',
          'divisions',
          'supervisor',
          'employeeTypes',
          'userTypes',
          'contractors'
        ];
        break;
      case 'inactive':
        this.filterFields = [
          'name',
          'code',
          'terminationDate',
          'terminationReason',
          'designations',
          'departments',
          'divisions',
          'supervisor',
          'contractors'
        ];
        break;
      case 'archived':
        this.filterFields = [
          'name',
          'code',
          'biometricId',
          'designations',
          'departments',
          'divisions',
          'supervisor',
          'employeeTypes',
          'userTypes',
          'contractors'
        ];
        break;
    }

    if (!this.isFilter) {
      this.fetchEmp();
    }
  }

  fetchEmp() {
    this.employees.fetch().catch(err => this.toastyService.error({ title: 'Error', msg: err }));
  }

  terminateEmp(empId: string, empName: string) {
    const dialog = this.dialog.open(RelievingDialogComponent, { width: '40%' });
    dialog.componentInstance.msg = `Are you sure to want to terminate ${empName} ?`;
    dialog.afterClosed().subscribe((emp: any) => {
      if (emp.reason) {
        const empl: any = {
          id: empId,
          dol: new Date().toISOString(),
          status: 'inactive',
          reason: emp.reason
        }

        this.employee.properties = empl;
        this.employee.update().then(
          data => {
            this.fetchEmp();
          }
        ).catch(err => this.toastyService.error({ title: 'Error', msg: err }))
      }

    })

  }
  downloadlink() {
    this.router.navigate(['pages/attendances/reports'], {
      queryParams: {
        type: 'employees-details'
      }
    })
  }

  import() {
    const dialogRef: MdDialogRef<FileUploaderDialogComponent> = this.dialog.open(FileUploaderDialogComponent);
    const component = dialogRef.componentInstance;
    component.uploader = this.emsEmployeeService.employees
    component.samples = [
      {
        name: 'Add Employee',
        mapper: 'default',
        url_csv: 'assets/formats/add-new-employee.csv',
        url_xlsx: 'assets/formats/add-new-employee.xlsx'
      }, {
        name: 'Update Employee',
        mapper: 'default',
        url_csv: 'assets/formats/update-employee.csv',
        url_xlsx: 'assets/formats/update-employee.xlsx'
      },
      {
        name: 'Update Biometric',
        mapper: 'default',
        url_csv: 'assets/formats/update-employee-biometricId.csv',
        url_xlsx: 'assets/formats/update-employee-biometricId.xlsx'
      },
      {
        name: 'Update Status',
        mapper: 'default',
        url_csv: 'assets/formats/update-employee-status.csv',
        url_xlsx: 'assets/formats/update-employee-status.xlsx'

      }];
  }
  ngOnInit() {

  }

}
