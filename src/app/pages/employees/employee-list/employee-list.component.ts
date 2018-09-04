import { Component, OnInit } from '@angular/core';
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


@Component({
  selector: 'aqua-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {

  employees: Page<EmsEmployee>
  employee: Model<EmsEmployee>
  statusFilter: string;
  uploader: FileUploader;
  isUpload = false;
  status;


  constructor(private emsEmployeeService: EmsEmployeeService,
    private toastyService: ToastyService,
    public validatorService: ValidatorService,
    private activatedRoute: ActivatedRoute,
    private store: LocalStorageService,
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

    this.employees = new Page({
      api: emsEmployeeService.employees,
      filters: [{
        field: 'name',
        value: null
      }, {
        field: 'code',
        value: null
      }, {
        field: 'status',
        value: 'activate'
      }]
    });

    this.employee = new Model({
      api: emsEmployeeService.employees,
      properties: new EmsEmployee()
    });
    this.fetchEmp();
  }

  fetchEmp(status?: string) {
    if (status) {
      this.status = status;
    }
    this.statusFilter = status ? status : 'activate';
    this.employees.filters.properties['status'].value = this.status ? this.status : 'activate';
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
          status: 'deactivate',
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
