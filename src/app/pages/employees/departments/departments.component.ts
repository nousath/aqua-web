import { Component, OnInit } from '@angular/core';
import { Page } from '../../../common/contracts/page';
import { Model } from '../../../common/contracts/model';
import { ValidatorService } from '../../../services';
import { EmsDepartmentService } from '../../../services/ems/ems-department.service';
import { ToastyService } from 'ng2-toasty';
import * as _ from 'lodash';
import { ConfirmDialogComponent } from '../../../dialogs/confirm-dialog/confirm-dialog.component';
import { MdDialog, MdDialogRef } from '@angular/material';
import { LocalStorageService } from '../../../services/local-storage.service';
import { Department } from '../../../models/department';
import { FileUploader } from 'ng2-file-upload';
import { FileUploaderDialogComponent } from '../../../shared/components/file-uploader-dialog/file-uploader-dialog.component';

@Component({
  selector: 'aqua-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.css']
})
export class DepartmentsComponent implements OnInit {
  departments: Page<Department>
  department: Model<Department>
  isNew = false;
  uploader: FileUploader;
  isUpload = false;

  constructor(private emsDepartmentService: EmsDepartmentService,
    public validatorService: ValidatorService,
    private store: LocalStorageService,
    private toastyService: ToastyService,
    public dialog: MdDialog) {

    this.departments = new Page({
      api: emsDepartmentService.departments,
      filters: [{
        field: 'divisionId',
        value: 1
      }]
    });

    this.department = new Model({
      api: emsDepartmentService.departments,
      properties: new Department()
    });

    this.fetchDepartment();
  }

  fetchDepartment() {
    this.departments.fetch().then(
      data => {
        _.each(this.departments.items, (item: Department) => {
          item['isEdit'] = false
        })
      }
    ).catch(err => this.toastyService.error({ title: 'Error', msg: err }));
  }

  toggleDepartment(isOpen?: boolean) {
    this.isNew = isOpen ? true : false;
    this.department.properties = new Department();
  }

  edit(department: Department, isEdit: boolean) {
    if (isEdit) {
      department.isEdit = true;
      this.store.setObject(`departmentEdit_${department.divisionId}`, department);
    } else {
      department.isEdit = false;
      const d: Department = this.store.getObject(`departmentEdit_${department.divisionId}`) as Department;
      department.code = d.code;
      department.name = d.name;
      this.store.removeItem(`departmentEdit_${department.divisionId}`);
    }
  }

  remove(id: number) {
    this.department.properties.divisionId = id;
    this.department.remove().then(data => {
      this.fetchDepartment()
    }).catch(err => this.toastyService.error({ title: 'Error', msg: err }));
  }

  removeConfirm(department: Department) {
    const dialog = this.dialog.open(ConfirmDialogComponent, { width: '40%' });
    dialog.componentInstance.msg = `Are you sure to want to remove department ${department.name} ?`;
    dialog.afterClosed().subscribe((value: boolean) => {
      if (value) {
        this.remove(department.divisionId)
      }
    })

  }

  save(department?: Department) {
    if (department) {
      this.department.properties = department;
    }
    if (!this.department.properties.name)
      return this.toastyService.info({ title: 'Info', msg: 'Enter  Name' });
    if (!this.department.properties.code)
      return this.toastyService.info({ title: 'Info', msg: 'Select  Code' });
    this.department.save().then(data => {
      if (department) {
        department.isEdit = false;
        this.store.removeItem(`leeaveBalance_${department.divisionId}`);
      } else {
        this.toggleDepartment();
      }
      this.fetchDepartment()
    }).catch(err => this.toastyService.error({ title: 'Error', msg: err }));
  }

  ngOnInit() {
  }

  import() {
    const dialogRef: MdDialogRef<FileUploaderDialogComponent> = this.dialog.open(FileUploaderDialogComponent);
    const component = dialogRef.componentInstance;
    component.uploader = this.emsDepartmentService.departments
    component.samples = [{
      name: 'CSV',
      mapper: 'default',
      url: 'assets/formats/Department.csv'
    }];
  }

}
