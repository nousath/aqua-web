import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
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

  uploader: FileUploader;
  isChangeImage = false;
  isUpload = false;

  imgUploadUrl: string = environment.apiUrls.ems;

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
  ) {

    this.initUploader()

    this.employee = new EmsEmployee()
    this.isProcessing = true;
    emsDesignationService.designations.search().then(designations => {
      this.designations = designations.items;
    });
    emsDepartmentService.departments.search().then(departments => {
      this.departments = departments.items;
    });

    activatedRoute.params.subscribe(params => {
      const empId = params['id'];
      this.fetchEmployee(empId)

    });
  }

  getAmsDetails(code) {
    console.log(this.employee.code)
    this.amsEmployeeService.employees
      .get(code)
      .then(amsEmployee => {
        this.amsEmployee = amsEmployee;
      });
  }

  fetchEmployee(id) {
    this.store.setItem('Ems-employeeID', id)
    if (!id) {
      return this.toastyService.error({ title: 'Error', msg: 'Please select an employee' });
    }
    this.isNew = id === 'new'
    if (this.isNew) {
      this.employee = new EmsEmployee()
      this.isProcessing = false

    } else {
      this.emsEmployeeService.employees.get(id).then(employee => {
        this.employee = employee;
        this.initEmployee(this.employee)
        this.isProcessing = false
        this.getAmsDetails(this.employee.code);

      }).catch(this.errorHandler);
    }
  }

  initEmployee(employee: EmsEmployee) {
    this.uploader.setOptions({ url: `/ems/api/employees/image/${employee.id}` });

    employee.profile = employee.profile || new Profile();

    if (employee.department && employee.department.code === 'default') {
      employee.department = null;
    }

    if (employee.designation && employee.designation.code === 'default') {
      employee.designation = null;
    }
    // employee.designation = employee.designation || new Designation();
    // employee.department = employee.department || new Department();
    employee.address = employee.address || new Address();

    employee.config = employee.config || new CustomFields();

    if (employee.profile.dob) { $('#dateSelector').datepicker('setDate', employee.profile.dob); }
    if (employee.config.dom) { $('#membershipDate').datepicker('setDate', employee.config.dom); }
    if (employee.doj) { $('#joiningDate').datepicker('setDate', employee.doj); }
    if (employee.dol) { $('#terminateDate').datepicker('setDate', employee.dol); }

    if (!employee.config.biometricId) {
      employee.config.biometricId = employee.code
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
      return this.toastyService.error({ title: 'Invalid Email', msg: 'Please fill valid email' })
    }

    this.isProcessing = true;

    this.beforeSave();

    const promise = this.isNew ?
      this.emsEmployeeService.employees.create(this.employee) :
      this.emsEmployeeService.employees.update(this.employee.id, this.employee);

    promise.then(data => {
      this.isProcessing = false
      this.toastyService.success({ title: 'Success', msg: `${this.employee.profile.firstName} ${this.employee.profile.lastName} ${this.isNew ? 'added' : 'updated'} successfully` });
      this.initEmployee(this.employee)
      if (this.isNew) {
        this.isNew = false;
        this.router.navigate(['../', data.code], { relativeTo: this.activatedRoute });
      }
    }).catch(this.errorHandler);
  }

  excel() {
    this.isUpload = !this.isUpload;
    this.uploader.clearQueue();
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
        }).catch(this.errorHandler)
      }
    });
  }

  empSource(keyword: string): Observable<EmsEmployee[]> {
    return this.autoCompleteService.searchByKey<EmsEmployee>('name', keyword, 'ems', 'employees');
  }

  empFormatter(data: EmsEmployee): string {
    return `${data.profile.firstName} ${data.profile.lastName}`.trim();
  }

  empListFormatter(data: EmsEmployee): string {
    const name = `${data.profile.firstName} ${data.profile.lastName}`.trim()
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
    }
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
    })
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

  initUploader = () => {
    const access_Token: string = this.store.getItem('external-token');
    const orgCode = this.store.getItem('orgCode');
    this.uploader = new FileUploader({
      itemAlias: 'image',
      allowedMimeType: ['image/png', 'image/gif', 'image/jpeg', 'image/jpg'],
      headers: [{
        name: 'x-access-token',
        value: access_Token
      }, {
        name: 'org-code',
        value: orgCode
      }]
    });

    this.uploader.onAfterAddingAll = (fileItems: FileItem) => {
      if (this.uploader.queue[this.uploader.queue.length - 1].file.size > 1048576 && this.uploader.queue.length > 0) {
        this.toastyService.info({ title: 'Info', msg: 'Image size should be less than 1 mb' })
        document.getElementById('uploader')['value'] = null;
        return this.uploader.clearQueue();
      }
      if (this.uploader.queue.length > 1)
        this.uploader.removeFromQueue(this.uploader.queue[0]);
    };

    this.uploader.onErrorItem = (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
      console.log('onErrorItem', response, headers);
    };

    this.uploader.onCompleteItem = (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {

      const res: any = JSON.parse(response);
      if (!res.isSuccess) {
        return this.toastyService.error({ title: 'Error', msg: 'Image upload failed' })
      }
      this.employee.profile.pic.url = `${res.message.picUrl}?time=${new Date().toString().replace(/ /g, '')}`;
      this.isChangeImage = false;

    };
  }

  getImgFromBase64(image: FileItem, base64: string, cb) {
    const canvas: HTMLCanvasElement = document.createElement('canvas'),
      ctx: CanvasRenderingContext2D = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      const ratio = img.width / img.height;
      img.width = img.width <= 150 ? img.width : 150;
      canvas.width = img.width;
      canvas.height = img.width / ratio;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const dataURI = canvas.toDataURL('image/jpeg', 0.6);

      const typeOfImage = image.file.type;
      const nameOfImage = image.file.name;
      // convert base64 to raw binary data held in a string
      const byteString = atob(dataURI.split(',')[1]);
      // separate out the mime component
      const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
      // write the bytes of the string to an ArrayBuffer
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      // write the ArrayBuffer to a blob, and you're done
      const bb = new Blob([ab], { type: typeOfImage });
      const file = new File([bb], nameOfImage, { type: typeOfImage });
      cb(file);
    };
    img.src = base64;

  }

  getBase64(image: FileItem, cb) {
    const reader = new FileReader();
    reader.onloadend = (e) => {
      this.getImgFromBase64(image, reader.result as any, cb);
    }
    return reader.readAsDataURL(image._file);
  }

  uploadImg() {
    if (!this.uploader.queue[0]) { return; }
    this.getBase64(this.uploader.queue[0], (file: any) => {
      this.uploader.clearQueue();
      this.uploader.addToQueue([file]);
      this.uploader.queue[0].upload();
    })
  }
}
