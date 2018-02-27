import { Component, OnInit } from '@angular/core';
import { LeaveType } from '../../../models';
import { Page } from '../../../common/contracts/page';
import { ValidatorService, AmsLeaveService } from '../../../services';
import { ToastyService } from 'ng2-toasty';
import { Model } from '../../../common/contracts/model';
import * as _ from 'lodash';
import { LocalStorageService } from 'app/services/local-storage.service';

@Component({
  selector: 'aqua-manage-leaves',
  templateUrl: './manage-leaves.component.html',
  styleUrls: ['./manage-leaves.component.css']
})
export class ManageLeavesComponent implements OnInit {

  leaveTypes: Page<LeaveType>;
  leaveType: Model<LeaveType>;
  isNew = false;

  constructor(public validatorService: ValidatorService,
    private amsLeaveService: AmsLeaveService,
    private store: LocalStorageService,
    private toastyService: ToastyService) {

    this.leaveTypes = new Page({
      api: amsLeaveService.leaveTypes
    });

    this.leaveType = new Model({
      api: amsLeaveService.leaveTypes,
      properties: new LeaveType()
    });

    this.fetchLeaveTypes();

  }

  toggleNew() {
    this.isNew = !this.isNew;
    this.leaveType.properties = new LeaveType();
  }

  remove(leaveType: LeaveType) {
    this.leaveType.properties = leaveType;
    this.leaveType.remove(
      data => {
        this.isNew = false;
        this.fetchLeaveTypes();
      }
    ).then().catch(err => this.toastyService.error({ title: 'Error', msg: err }));
  }

  fetchLeaveTypes() {
    this.leaveTypes.fetch(
      data => {
        _.each(this.leaveTypes.items, (item: LeaveType) => {
          item['category'] = item.category ? item.category : null;
          item['isEdit'] = false;
        });
      }
    ).catch(err => this.toastyService.error({ title: 'Error', msg: err }));
  }

  toggleLeaveType(leaveType: LeaveType, isEdit: boolean) {
    if (isEdit) {
      leaveType.isEdit = true;
      this.store.setObject(`leaveType${leaveType.id}`, leaveType);
    } else {
      leaveType.isEdit = false;
      const l: LeaveType = this.store.getObject(`leaveType${leaveType.id}`) as LeaveType;
      leaveType.category = l.category;
      leaveType.unitsPerDay = l.unitsPerDay;
      leaveType.code = l.code;
      leaveType.name = l.name;
      this.store.removeItem(`leaveType${leaveType.id}`);
    }
  }

  saveLeaveType(leaveType?: LeaveType) {
    if (leaveType) {
      this.leaveType.properties = leaveType;
    }

    if (!this.leaveType.properties.category)
      return this.toastyService.info({ title: 'Info', msg: 'Select category' });
    if (this.leaveType.properties.unlimited === null || this.leaveType.properties.unlimited === undefined)
      return this.toastyService.info({ title: 'Info', msg: 'Select Yes if user can take unlimited leaves otherwise select No' });
    if (!this.leaveType.properties.name)
      return this.toastyService.info({ title: 'Info', msg: 'Enter name' });
    if (!this.leaveType.properties.unitsPerDay)
      return this.toastyService.info({ title: 'Info', msg: 'Select units per day' });

    const unlimited: any = 'true';
    this.leaveType.properties.unlimited = this.leaveType.properties.unlimited === unlimited ? true : false;

    this.leaveType.save(
      data => {
        if (this.isNew) {
          this.isNew = false;
          this.fetchLeaveTypes();
        } else {
          leaveType.isEdit = false
        }
      }
    ).then().catch(err => this.toastyService.error({ title: 'Error', msg: err }));
  }

  ngOnInit() {
  }

}
