import { Component, OnInit } from '@angular/core';
import { Page } from '../../../common/contracts/page';
import { Designation } from '../../../models';
import { Model } from '../../../common/contracts/model';
import { ValidatorService } from '../../../services';
import { EmsDesignationService } from '../../../services/ems/ems-designation.service';
import { ToastyService } from 'ng2-toasty';
import * as _ from 'lodash';
import { ConfirmDialogComponent } from '../../../dialogs/confirm-dialog/confirm-dialog.component';
import { MdDialog, MdDialogRef } from '@angular/material';
import { LocalStorageService } from '../../../services/local-storage.service';
import { FileUploader } from 'ng2-file-upload';
import { FileUploaderDialogComponent } from '../../../shared/components/file-uploader-dialog/file-uploader-dialog.component';

@Component({
  selector: 'aqua-designations',
  templateUrl: './designations.component.html',
  styleUrls: ['./designations.component.css']
})
export class DesignationsComponent implements OnInit {

  designations: Page<Designation>
  designation: Model<Designation>
  isNew = false;
  uploader: FileUploader;
  isUpload = false;
  isFilter = false;
  filterFields = [
    'designations'
  ]


  constructor(private emsDesignationService: EmsDesignationService,
    public validatorService: ValidatorService,
    private store: LocalStorageService,
    private toastyService: ToastyService,
    public dialog: MdDialog) {

    this.designations = new Page({
      api: emsDesignationService.designations,
      filters: [
        'ofDate',
        'designations'
      ]
    });

    this.designation = new Model({
      api: emsDesignationService.designations,
      properties: new Designation()
    });

    this.fetchDesignation();
  }

  fetchDesignation() {
    this.designations.fetch().then(
      data => {
        _.each(this.designations.items, (item: Designation) => {
          item['isEdit'] = false
        })
      }
    ).catch(err => this.toastyService.error({ title: 'Error', msg: err }));
  }

  applyFilters(result) {
    const filters = this.designations.filters.properties;

    const values = result.params;

    filters['designations']['value'] = values.employee.designations ? values.employee.designations.map(item => item.name) : '';
    this.fetchDesignation();
  }

  reset() {

  }

  toggleDesignation(isOpen?: boolean) {
    this.isNew = isOpen ? true : false;
    this.designation.properties = new Designation();
  }

  edit(designation: Designation, isEdit: boolean) {
    if (isEdit) {
      designation.isEdit = true;
      this.store.setObject(`designationEdit_${designation.id}`, designation);
    } else {
      designation.isEdit = false;
      const d: Designation = this.store.getObject(`designationEdit_${designation.id}`) as Designation;
      designation.code = d.code;
      designation.name = d.name;
      this.store.removeItem(`designationEdit_${designation.id}`);
    }
  }

  remove(id: number) {
    this.designation.properties.id = id;
    this.designation.remove().then(data => {
      this.fetchDesignation()
    }).catch(err => this.toastyService.error({ title: 'Error', msg: err }));
  }

  removeConfirm(designation: Designation) {
    const dialog = this.dialog.open(ConfirmDialogComponent, { width: '40%' });
    dialog.componentInstance.msg = `Are you sure to want to remove designation ${designation.name} ?`;
    dialog.afterClosed().subscribe((value: boolean) => {
      if (value) {
        this.remove(designation.id)
      }
    })

  }

  nameChange() {
    this.designation.properties.code = this.designation.properties.code;
    console.log(this.designation.properties.name)
    console.log(this.designation.properties.code)
  }

  save(designation?: Designation) {
    if (designation) {
      this.designation.properties = designation;
    }
    if (!this.designation.properties.name)
      return this.toastyService.info({ title: 'Info', msg: 'Enter  Name' });
    this.designation.save().then(data => {
      if (designation) {
        designation.isEdit = false;
        this.store.removeItem(`leeaveBalance_${designation.id}`);
      } else {
        this.toggleDesignation();
      }
      this.fetchDesignation()
    }).catch(err => this.toastyService.error({ title: 'Error', msg: err }));
  }

  import() {
    const dialogRef: MdDialogRef<FileUploaderDialogComponent> = this.dialog.open(FileUploaderDialogComponent);
    const component = dialogRef.componentInstance;
    component.uploader = this.emsDesignationService.designations
    component.samples = [{
      name: 'CSV/Excel',
      mapper: 'default',
      url_csv: 'assets/formats/designation.csv',
      url_xlsx: 'assets/formats/designation.xlsx'
    }];
  }


  ngOnInit() {
  }

}
