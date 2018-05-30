import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { EmsEmployeeService, EmsDesignationService } from '../../../services/ems';
import { ToastyService } from 'ng2-toasty';
import { ActivatedRoute, Router } from '@angular/router';
import { Model } from '../../../common/contracts/model';
import { Employee, Designation } from '../../../models';
import { Subscription, Observable } from 'rxjs/Rx';
import { EmsEmployee, Supervisor } from '../../../models/ems/employee';
import { ValidatorService } from '../../../services/validator.service';
import { AutoCompleteService } from '../../../services/auto-complete.service';
import { NgForm } from '@angular/forms';
import { Page } from '../../../common/contracts/page';
import { MdDialog } from '@angular/material';
import { ResetPasswordDialogComponent } from '../../../dialogs/reset-password-dialog/reset-password-dialog.component';
import { FileUploader, ParsedResponseHeaders, FileItem, FileLikeObject } from 'ng2-file-upload';
import * as _ from "lodash";
import { LocalStorageService } from '../../../services/local-storage.service';
import { environment } from '../../../../environments/environment.qa';
import { LeaveActionDialogComponent } from '../../../dialogs/leave-action-dialog/leave-action-dialog.component';
declare var $: any;


@Component({
  selector: 'aqua-emp-edit',
  templateUrl: './emp-edit.component.html',
  styleUrls: ['./emp-edit.component.css']
})
export class EmpEditComponent implements OnInit, OnDestroy, AfterViewInit {

  employee: Model<EmsEmployee>;
  designations: Page<Designation>;
  subscription: Subscription;
  uploader: FileUploader;
  isChangeImage: boolean = false;
  imgUploadUrl: string = environment.apiUrls.ems;

  isNew: boolean = false;

  constructor(private emsEmployeeService: EmsEmployeeService,
    private toastyService: ToastyService,
    private activatedRoute: ActivatedRoute,
    private autoCompleteService: AutoCompleteService,
    public validatorService: ValidatorService,
    private emsDesignationService: EmsDesignationService,
    private store: LocalStorageService,
    private dialog: MdDialog,
    private router: Router) {

    let access_Token: string = this.store.getItem('external-token');
    let orgCode = this.store.getItem('orgCode');
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

      let res: any = JSON.parse(response);
      if (!res.isSuccess)
        return toastyService.error({ title: 'Error', msg: 'Image upload failed' })
      this.employee.properties.picUrl = `${res.message.picUrl}?time=${new Date().toString().replace(/ /g, "")}`;
      this.isChangeImage = false;

    };

    this.designations = new Page({
      api: emsDesignationService.designations,
      filters: [{
        field: 'level',
        value: 1
      }]
    });

    this.designations.fetch().then(() => {
      _.each(this.designations.items, (item: Designation) => {
        if (item.name)
          item.name = item.name.toLowerCase();
      })
    }).catch(err => this.toastyService.error({ title: 'Error', msg: err }));

    this.employee = new Model({
      api: emsEmployeeService.employees,
      properties: new EmsEmployee()
    });

    this.subscription = activatedRoute.params.subscribe(
      params => {
        let empId = params['id'];
        if (!empId)
          return this.toastyService.error({ title: 'Error', msg: 'Please select an employee' });
        empId == 'new' ?
          (this.isNew = true) :
          this.employee.fetch(empId).then(
            data => {
              this.uploader.setOptions({ url: `/ems/api/employees/image/${empId}` });
              if (this.employee.properties.dob) { $("#dateSelector").datepicker("setDate", new Date(this.employee.properties.dob)); }
              if (this.employee.properties.dol) { $("#terminateDate").datepicker("setDate", new Date(this.employee.properties.dol)); }
              if (this.employee.properties.doj) { $("#joiningDate").datepicker("setDate", new Date(this.employee.properties.doj)); }
              this.employee.properties.supervisor = this.employee.properties.supervisor ? this.employee.properties.supervisor : new Supervisor();
              // this.employee.properties.designation = this.employee.properties.designation ? this.employee.properties.designation : new Designation();
              this.employee.properties.designation = this.employee.properties.designation ? this.employee.properties.designation.toLowerCase() : null;

              if (this.employee.properties.supervisor) {
                emsEmployeeService.employees.get(this.employee.properties.supervisor.id).then(supervisor => {
                  this.employee.properties.supervisor.designation = supervisor.designation;
                })
              }
            }
          ).catch(err => this.toastyService.error({ title: 'Error', msg: err }));
      }
    );

    this.store.setItem('Ems-employeeID', this.employee.properties.id)

  }

  save(form: NgForm) {
    if (form.invalid) {
      return this.toastyService.info({ title: 'Info', msg: 'Please fill all mandatory fields' })
    }

    if (this.employee.properties.email && !this.validatorService.validateEmail(this.employee.properties.email))
      return this.toastyService.info({ title: 'Info', msg: 'Please fill valid email' })

    let d: any = this.employee.properties.designation ? _.find(this.designations.items, (item: Designation) => {
      return item.name.toLowerCase() == this.employee.properties.designation.toLowerCase()
    }) : null;
    this.employee.properties.designation = d ? d : null;

    if (this.isNew)
      this.employee.properties.status = 'activate';
    if (this.employee.properties.dol)

      if (this.employee.properties.picUrl)
        this.employee.properties.picUrl = this.employee.properties.picUrl.indexOf('?time=') == -1 ?
          this.employee.properties.picUrl :
          this.employee.properties.picUrl.slice(0, this.employee.properties.picUrl.indexOf('?time='));

    this.employee.save().then(
      data => {
        if (this.isNew) {
          this.isNew = false;
          this.toastyService.success({ title: 'Success', msg: `${this.employee.properties.name} added successfully` });
          this.employee.properties.designation = this.employee.properties.designation ? this.employee.properties.designation.toLowerCase() : null;
          this.employee.properties.supervisor = this.employee.properties.supervisor ? this.employee.properties.supervisor : new Supervisor();
          this.router.navigate(['../', this.employee.properties.id], { relativeTo: this.activatedRoute });
        } else {
          this.toastyService.success({ title: 'Success', msg: `${this.employee.properties.name} updated successfully` });

        }
      }
    ).catch(err => this.toastyService.error({ title: 'Error', msg: err }));
  }

  resetPassword() {
    let dialog = this.dialog.open(ResetPasswordDialogComponent, { width: '40%' });
    dialog.afterClosed().subscribe(
      (password: string) => {
        if (password) {
          this.employee.isProcessing = true;
          let emp: any = {
            password: password
          };
          this.emsEmployeeService.employees.update(this.employee.properties.id, emp)
            .then(data => {
              this.employee.isProcessing = false;
              this.toastyService.success({ title: 'Success', msg: 'Password updated successfully' });
            })
            .catch(err => { this.employee.isProcessing = false; this.toastyService.error({ title: 'Error', msg: err }) });
        }
      }
    );
  }
  // terminateEmp(form: NgForm) {
  //   if (form.invalid) {
  //     return this.toastyService.info({ title: 'Info', msg: 'Please fill all mandatory fields' })
  //   }
  //   console.log(this.employee.properties.id);
  //   console.log(this.employee.properties.name);


  // }


  empSource(keyword: string): Observable<EmsEmployee[]> {
    return this.autoCompleteService.searchByKey<EmsEmployee>('name', keyword, 'ems', 'employees');
  }

  empFormatter(data: Employee): string {
    return data.name;
  }

  empListFormatter(data: Employee): string {
    return `${data.name} (${data.code})`;
  }

  ngOnInit() {
  }

  uploadImg() {
    if (this.uploader.queue[0]) {
      this.getBase64(this.uploader.queue[0], (file: any) => {
        this.uploader.clearQueue();
        this.uploader.addToQueue([file]);
        this.uploader.queue[0].upload();
      })
    }
  }

  getBase64(image: FileItem, cb) {
    let reader = new FileReader();
    reader.onloadend = (e) => {
      this.getImgFromBase64(image, reader.result, cb);
    }
    return reader.readAsDataURL(image._file);
  }

  getImgFromBase64(image: FileItem, base64: string, cb) {
    let canvas: HTMLCanvasElement = document.createElement("canvas"),
      ctx: CanvasRenderingContext2D = canvas.getContext("2d");
    let img = new Image();
    img.onload = () => {
      let ratio = img.width / img.height;
      img.width = img.width <= 150 ? img.width : 150;
      canvas.width = img.width;
      canvas.height = img.width / ratio;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      let dataURI = canvas.toDataURL("image/jpeg", 0.6);

      let typeOfImage = image.file.type;
      let nameOfImage = image.file.name;
      // convert base64 to raw binary data held in a string
      let byteString = atob(dataURI.split(',')[1]);
      // separate out the mime component
      let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
      // write the bytes of the string to an ArrayBuffer
      let ab = new ArrayBuffer(byteString.length);
      let ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      // write the ArrayBuffer to a blob, and you're done
      let bb = new Blob([ab], { type: typeOfImage });
      let file = new File([bb], nameOfImage, { type: typeOfImage });
      cb(file);
    };
    img.src = base64;

  }

  ngAfterViewInit() {
    if (this.employee.properties.dob) { $("#dateSelector").datepicker("setDate", new Date(this.employee.properties.dob)); }
    $('#dateSelector').datepicker({
      format: 'dd/mm/yyyy',
      minViewMode: 0,
      maxViewMode: 2,
      autoclose: true
    }).on('changeDate', (e) => {
      this.employee.properties.dob = new Date(e.date).toISOString();
    });
    if (this.employee.properties.dol) { $("#terminateDate").datepicker("setDate", new Date(this.employee.properties.dol)); }
    $('#terminateDate').datepicker({
      format: 'dd/mm/yyyy',
      minViewMode: 0,
      maxViewMode: 2,
      autoclose: true
    }).on('changeDate', (d) => {
      this.employee.properties.dol = new Date(d.date).toISOString();
    });
    if (this.employee.properties.doj) { $("#joiningDate").datepicker("setDate", new Date(this.employee.properties.doj)); }
    $('#joiningDate').datepicker({
      format: 'dd/mm/yyyy',
      minViewMode: 0,
      maxViewMode: 2,
      autoclose: true
    }).on('changeDate', (d) => {
      this.employee.properties.doj = new Date(d.date).toISOString();
    });

  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
