import { Component, OnInit, OnDestroy, AfterViewInit, ViewContainerRef } from '@angular/core';
import { EmsEmployeeService, EmsDesignationService, EmsDepartmentService } from '../../../services/ems';
import { ToastyService } from 'ng2-toasty';
import { ActivatedRoute, Router } from '@angular/router';
import { Employee, Designation } from '../../../models';
import { Observable } from 'rxjs/Rx';
import { EmsEmployee, CustomFields, Address, Profile } from '../../../models/ems/employee';
import { ValidatorService } from '../../../services/validator.service';
import { AutoCompleteService } from '../../../services/auto-complete.service';
import { NgForm } from '@angular/forms';
import { MdDialog } from '@angular/material';
import { Location } from '@angular/common';
import { ResetPasswordDialogComponent } from '../../../dialogs/reset-password-dialog/reset-password-dialog.component';
import { FileUploader, ParsedResponseHeaders, FileItem, FileLikeObject } from 'ng2-file-upload';
import * as _ from 'lodash';
import { LocalStorageService } from '../../../services/local-storage.service';
import { environment } from '../../../../environments/environment.qa';
import { Department } from '../../../models/department';
import { AmsEmployeeService } from '../../../services/index';
import { DriveService } from '../../../shared/services/drive.service';
import { UxService } from '../../../services/ux.service';
declare var $: any;


@Component({
  selector: 'aqua-emp-edit',
  templateUrl: './emp-edit.component.html',
  styleUrls: ['./emp-edit.component.css']
})
export class EmpEditComponent implements OnInit, OnDestroy, AfterViewInit {

  employee: EmsEmployee;
  amsEmployee: Employee;

  designations: Designation[];
  departments: Department[];

  isProcessing = false;
  newImageFile: File;

  // uploader: FileUploader;
  isChangeImage = false;
  isUploadingImage = false;

  // imgUploadUrl: string = environment.apiUrls.ems;

  isNew = false;

  constructor(private emsEmployeeService: EmsEmployeeService,
    private toastyService: ToastyService,
    private activatedRoute: ActivatedRoute,
    private autoCompleteService: AutoCompleteService,
    public validatorService: ValidatorService,
    private emsDesignationService: EmsDesignationService,
    private emsDepartmentService: EmsDepartmentService,
    private store: LocalStorageService,
    private dialog: MdDialog,
    private router: Router,
    public _location: Location,
    private amsEmployeeService: AmsEmployeeService,
    private uxService: UxService,
    public viewContainerRef: ViewContainerRef
  ) {

    // this.initUploader()

    this.employee = new EmsEmployee();
    this.isProcessing = true;


    activatedRoute.params.subscribe(params => {
      const empId = params['id'];
      this.fetchEmployee(empId);

    });
  }

  getAmsDetails(code) {
    console.log(this.employee.code);
    this.amsEmployeeService.employees
      .get(code)
      .then(amsEmployee => {
        this.amsEmployee = amsEmployee;
      });
  }

  fetchEmployee(id) {
    this.store.setItem('Ems-employeeID', id);
    if (!id) {
      return this.toastyService.error({ title: 'Error', msg: 'Please select an employee' });
    }
    this.isNew = id === 'new';
    if (this.isNew) {
      this.employee = new EmsEmployee();
      this.isProcessing = false;

    } else {
      this.emsEmployeeService.employees.get(id).then(employee => {
        this.employee = employee;
        this.initEmployee(this.employee);
        this.isProcessing = false;
        this.getAmsDetails(this.employee.code);

      }).catch(this.errorHandler);
    }
  }

  initEmployee(employee: EmsEmployee) {
    // this.uploader.setOptions({ url: `/ems/api/employees/image/${employee.id}` });

    employee.profile = employee.profile || new Profile();

    if (employee.department && employee.department.code === 'default') {
      employee.department = null;
    }

    if (employee.designation && employee.designation.code === 'default') {
      employee.designation = null;
    }

    this.emsDesignationService.designations.search().then(designations => {
      this.designations = designations.items;
      if (employee.designation) {
        employee.designation = this.designations.find(item => item.id === employee.designation.id);
      }
    });
    this.emsDepartmentService.departments.search().then(departments => {
      this.departments = departments.items;
      if (employee.department) {
        employee.department = this.departments.find(item => item.id === employee.department.id);
      }
    });


    // employee.department = employee.department || new Department();
    employee.address = employee.address || new Address();

    employee.config = employee.config || new CustomFields();

    if (employee.profile.dob) { $('#dateSelector').datepicker('setDate', employee.profile.dob); }
    if (employee.config.dom) { $('#membershipDate').datepicker('setDate', employee.config.dom); }
    if (employee.doj) { $('#joiningDate').datepicker('setDate', employee.doj); }
    if (employee.dol) { $('#terminateDate').datepicker('setDate', employee.dol); }

    if (!employee.config.biometricId) {
      employee.config.biometricId = employee.code;
    }
    // this.employee.supervisor = this.employee.supervisor ? this.employee.supervisor : new Supervisor();
    // this.employee.designation = this.employee.designation ? this.employee.designation : new Designation();
    // this.employee.designation = this.employee.designation ? this.employee.designation.toLowerCase() : null;

    // if (this.employee.supervisor) {
    //   emsEmployeeService.employees.get(this.employee.supervisor.id).then(supervisor => {
    //     this.employee.supervisor.designation = supervisor.designation;
    //   })
    // }
    // this.employee.supervisor = this.employee.supervisor ? this.employee.supervisor : new Supervisor();
  }

  beforeSave() {
    const employee = this.employee;
    if (this.isNew) {
      employee.status = 'active';
    }

    const profile = employee.profile;

    if (profile.pic && profile.pic.url) {
      profile.pic.url = profile.pic.url.indexOf('?time=') === -1 ?
        profile.pic.url :
        profile.pic.url.slice(0, profile.pic.url.indexOf('?time='));
    }
  }

  save() {
    // if (!this.employee.code) {
    //   return this.toastyService.error({ title: 'Code', msg: 'Code is required' })
    // }

    if (this.employee.email && !this.validatorService.validateEmail(this.employee.email)) {
      return this.toastyService.error({ title: 'Invalid Email', msg: 'Please fill valid email' });
    }

    this.isProcessing = true;

    this.beforeSave();

    const promise = this.isNew ?
      this.emsEmployeeService.employees.create(this.employee) :
      this.emsEmployeeService.employees.update(this.employee.id, this.employee);

    promise.then(data => {
      this.isProcessing = false;
      this.toastyService.success({ title: 'Success', msg: `${this.employee.profile.firstName} ${this.employee.profile.lastName} ${this.isNew ? 'added' : 'updated'} successfully` });
      this.initEmployee(this.employee);
      if (this.isNew) {
        this.isNew = false;
        this.router.navigate(['../', data.code], { relativeTo: this.activatedRoute });
      }
    }).catch(this.errorHandler);
  }

  excel() {
    this.isUploadingImage = !this.isUploadingImage;
    // this.uploader.clearQueue();
  }

  resetPassword() {
    const dialog = this.dialog.open(ResetPasswordDialogComponent, { width: '40%' });
    dialog.afterClosed().subscribe((password: string) => {
      this.isProcessing = true;

      if (password) {
        const emp: any = {
          password: password
        };
        this.emsEmployeeService.employees.update(this.employee.id, emp).then(data => {
          this.isProcessing = false;
          this.toastyService.success({ title: 'Success', msg: 'Password updated successfully' });
        }).catch(this.errorHandler);
      }
    });
  }

  empSource(keyword: string): Observable<EmsEmployee[]> {
    return this.autoCompleteService.searchByKey<EmsEmployee>('name', keyword, 'ems', 'employees');
  }

  empFormatter(data: EmsEmployee): string {
    return `${data.profile.firstName} ${data.profile.lastName || ''}`.trim();
  }

  empListFormatter(data: EmsEmployee): string {
    const name = `${data.profile.firstName} ${data.profile.lastName || ''}`.trim();
    return `${data.code}:${name}`;
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    const pickerOptions = {
      format: 'dd/mm/yyyy',
      minViewMode: 0,
      maxViewMode: 2,
      autoclose: true
    };
    $('#dateSelector').datepicker(pickerOptions).on('changeDate', (e) => {
      this.employee.profile.dob = new Date(e.date);
    });
    $('#terminateDate').datepicker(pickerOptions).on('changeDate', (d) => {
      this.employee.dol = new Date(d.date);
    });
    $('#joiningDate').datepicker(pickerOptions).on('changeDate', (d) => {
      this.employee.doj = new Date(d.date);
    });
    $('#membershipDate').datepicker(pickerOptions).on('changeDate', (d) => {
      this.employee.config.dom = new Date(d.date);
    });
  }

  downloadlink() {
    this.router.navigate(['pages/attendances/reports'], {
      queryParams: {
        type: 'employees-details'
      }
    });
  }

  ngOnDestroy() {
  }

  backClicked() {
    this._location.back();
  }

  errorHandler = (err) => {
    this.isProcessing = false;
    this.toastyService.error({ title: 'Error', msg: err });
  }

  onNewImageSelect($event) {

    if (!$event.target.files || !$event.target.files[0]) {
      return;
    }

    const file = $event.target.files[0];
    if (file.size > 3000000) {// 3MB
      return this.toastyService.error({ title: 'Error', msg: `The image was too big. <br\> Select an image smaller than 3MB.` });
    }

    this.uxService.getImageEditor({
      file: file,
      width: 500,
      height: 500,
      entity: { type: 'employee', id: this.employee.id },
      folder: 'profile',
      cancel: true
    }, this.viewContainerRef).subscribe(doc => {
      this.isUploadingImage = false;
      this.employee.profile.pic.url = doc.url;
      $event.target.value = null;

    }, error => {
      this.isUploadingImage = false;
      $event.target.value = null;
    });
  }
}
