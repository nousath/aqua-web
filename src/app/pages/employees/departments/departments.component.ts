import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Page } from '../../../common/contracts/page';
import { Model } from '../../../common/contracts/model';
import { ValidatorService, AutoCompleteService } from '../../../services';
import { EmsDepartmentService } from '../../../services/ems/ems-department.service';
import { ToastyService } from 'ng2-toasty';
import * as _ from 'lodash';
import { ConfirmDialogComponent } from '../../../dialogs/confirm-dialog/confirm-dialog.component';
import { MdDialog, MdDialogRef } from '@angular/material';
import { LocalStorageService } from '../../../services/local-storage.service';
import { Department } from '../../../models/department';
import { FileUploader } from 'ng2-file-upload';
import { FileUploaderDialogComponent } from '../../../shared/components/file-uploader-dialog/file-uploader-dialog.component';
import { ServerPageInput } from '../../../common/contracts/api';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'aqua-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.css']
})
export class DepartmentsComponent implements OnInit {
  departments: Page<Department>
  department: Model<Department>
  dept: Department[];
  departmentId: number;
  selectedDepartment: Department;
  isNew = false;
  uploader: FileUploader;
  isUpload = false;
  isFilter = false;
  departmentList = [];
  statusFilter = 'active';
  filterFields = [
    'name',
    'status'
  ]

  @Output()
  onChange: EventEmitter<any> = new EventEmitter();
  dropdownSettings = {};

  constructor(private emsDepartmentService: EmsDepartmentService,
    public validatorService: ValidatorService,
    private store: LocalStorageService,
    private autoCompleteService: AutoCompleteService,
    private toastyService: ToastyService,
    public dialog: MdDialog) {

    this.departments = new Page({
      api: emsDepartmentService.departments,
      filters: [{
        field: 'divisionId',
        value: 1,
      },
        'ofDate',
        'name',
      'status']
    });

    this.department = new Model({
      api: emsDepartmentService.departments,
      properties: new Department()
    });

    this.fetchDepartment();
  }
  onSelectDept(cont: Department) {
    this.selectedDepartment = cont
  }
  deptSource(keyword: string): Observable<Department[]> {
    return this.autoCompleteService.searchByKey<Department>('name', keyword, 'ems', 'departments');
  }
  deptFormatter(data: Department): string {
    return data.name;
  }
  deptListFormatter(data: Department): string {
    return `${data.name} (${data.code})`;
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
  fetchByStatus() {
    this.apply()
  }
  applyFilters(params) {
    const filters = this.departments.filters.properties;
    const values = params.department
    filters['status'].value = this.statusFilter ? this.statusFilter : 'active';
    filters['name']['value'] = values && values.name ? values.name : '';
    this.fetchDepartment();
  }
  apply() {
    const params: any = {}
    if (this.selectedDepartment) {
      params.department = {
        id: this.selectedDepartment.id,
        code: this.selectedDepartment.code,
        name: this.selectedDepartment.name
      }
    }
    this.applyFilters(params)
  }
  private getDepartments() {
    const deptFilter = new ServerPageInput();
    deptFilter.query = {
      divisionId: 1
    }
    this.emsDepartmentService.departments.search(deptFilter).then(page => {
      this.dept = page.items;
      this.departmentList = [];
      this.dept.forEach(item => {
        const obj = {
          id: item.id,
          itemName: item.name,
        };
        this.departmentList.push(obj);
      })
    });
  }
  reset() {
    this.selectedDepartment = null;
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
    this.department.properties.id = id;
    this.department.remove().then(data => {
      this.fetchDepartment()
    }).catch(err => this.toastyService.error({ title: 'Error', msg: err }));
  }

  nameChange() {
    this.department.properties.code = this.department.properties.code;
  }

  removeConfirm(department: Department) {
    const dialog = this.dialog.open(ConfirmDialogComponent, { width: '40%' });
    dialog.componentInstance.msg = `Are you sure to want to remove department ${department.name} ?`;
    dialog.afterClosed().subscribe((value: boolean) => {
      if (value) {
        this.remove(department.id)
      }
    })
  }
  save(department?: Department) {
    if (department) {
      this.department.properties = department;
    }
    if (!this.department.properties.name)
      return this.toastyService.info({ title: 'Info', msg: 'Enter  Name' });
    this.department.save().then(data => {
      if (department) {
        department.isEdit = false;
        this.store.removeItem(`leaveBalance_${department.divisionId}`);
      } else {
        this.toggleDepartment();
      }
      this.fetchDepartment()
    }).catch(err => this.toastyService.error({ title: 'Error', msg: err }));
  }

  ngOnInit() {
    this.getDepartments();
  }

  import() {
    const dialogRef: MdDialogRef<FileUploaderDialogComponent> = this.dialog.open(FileUploaderDialogComponent);
    const component = dialogRef.componentInstance;
    component.uploader = this.emsDepartmentService.departments
    component.samples = [{
      name: 'CSV/Excel',
      mapper: 'default',
      url_csv: 'assets/formats/department.csv',
      url_xlsx: 'assets/formats/department.xlsx'
    }];
  }

}
