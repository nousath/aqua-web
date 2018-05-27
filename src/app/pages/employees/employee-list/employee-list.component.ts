import { Component, OnInit } from '@angular/core';
import { EmsEmployeeService } from '../../../services/ems';
import { Employee } from '../../../models/employee';
import { Page } from '../../../common/contracts/page';
import { ToastyService } from 'ng2-toasty';
import { MdDialog } from "@angular/material";
import { Model } from '../../../common/contracts/model';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { EmsEmployee } from '../../../models/ems/employee';
import { Filter } from '../../../common/contracts/filters';
import * as _ from "lodash";
import { ConfirmDialogComponent } from '../../../dialogs/confirm-dialog/confirm-dialog.component';
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { LocalStorageService } from "app/services/local-storage.service";
import { ValidatorService } from '../../../services/validator.service';

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
  isUpload: boolean = false;
  status;


  constructor(private emsEmployeeService: EmsEmployeeService,
    private toastyService: ToastyService,
    public validatorService: ValidatorService,
    private activatedRoute: ActivatedRoute,
    private store: LocalStorageService,
    private router: Router,
    public dialog: MdDialog) {

    let access_Token: string = this.store.getItem('external-token');
    let orgCode = this.store.getItem('orgCode');
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

      let res: any = JSON.parse(response);
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

  excel() {
    this.isUpload = !this.isUpload;
    this.uploader.clearQueue();
  }

  terminateEmp(empId: string, empName: string) {
    let dialog = this.dialog.open(ConfirmDialogComponent, { width: '40%' });
    dialog.componentInstance.msg = `Are you sure to want to terminate ${empName} ?`;
    dialog.afterClosed().subscribe((value: boolean) => {
      if (value) {
        let emp: any = {
          id: empId,
          status: 'deactivate'
        }
        this.employee.properties = emp;
        // this.employee.properties.status = 'inactive';
        this.employee.update().then(
          data => {
            this.fetchEmp();
          }
        ).catch(err => this.toastyService.error({ title: 'Error', msg: err }))
      }
    })

  }
  downloadlink() {
    this.router.navigate(['pages/attendances/reports'])
  }
  ngOnInit() {
  }

}
