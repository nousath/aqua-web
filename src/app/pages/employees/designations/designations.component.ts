import { Component, OnInit } from '@angular/core';
import { Page } from '../../../common/contracts/page';
import { Designation } from '../../../models';
import { Model } from '../../../common/contracts/model';
import { ValidatorService } from '../../../services';
import { EmsDesignationService } from '../../../services/ems/ems-designation.service';
import { ToastyService } from 'ng2-toasty';
import * as _ from 'lodash';
import { ConfirmDialogComponent } from '../../../dialogs/confirm-dialog/confirm-dialog.component';
import { MdDialog } from '@angular/material';
import { LocalStorageService } from 'app/services/local-storage.service';

@Component({
  selector: 'aqua-designations',
  templateUrl: './designations.component.html',
  styleUrls: ['./designations.component.css']
})
export class DesignationsComponent implements OnInit {

  designations: Page<Designation>
  designation: Model<Designation>
  isNew = false;

  constructor(private emsDesignationService: EmsDesignationService,
    public validatorService: ValidatorService,
    private store: LocalStorageService,
    private toastyService: ToastyService,
    public dialog: MdDialog) {

    this.designations = new Page({
      api: emsDesignationService.designations
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

  save(designation?: Designation) {
    if (designation) {
      this.designation.properties = designation;
    }
    if (!this.designation.properties.name)
      return this.toastyService.info({ title: 'Info', msg: 'Enter  Name' });
    if (!this.designation.properties.code)
      return this.toastyService.info({ title: 'Info', msg: 'Select  Code' });
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

  ngOnInit() {
  }

}
