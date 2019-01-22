import { Component, OnInit } from '@angular/core';
import { LeaveType } from '../../../models';
import { PagerModel } from '../../../common/ng-structures';
import { ValidatorService, AmsLeaveService } from '../../../services';
import { ToastyService } from 'ng2-toasty';

@Component({
  selector: 'aqua-manage-leaves',
  templateUrl: './manage-leaves.component.html',
  styleUrls: ['./manage-leaves.component.css']
})
export class ManageLeavesComponent implements OnInit {

  leaveTypes: PagerModel<LeaveType>;
  leaveTypeModel: LeaveType = new LeaveType()
  isEdit = false;

  constructor(public validatorService: ValidatorService,
    private amsLeaveService: AmsLeaveService,
    private toastyService: ToastyService) {

    this.leaveTypes = new PagerModel({
      api: amsLeaveService.leaveTypes
    });

    this.fetchLeaveTypes();
  }

  remove(leaveType: LeaveType) {
    this.amsLeaveService.leaveTypes.remove(leaveType.id).then(data => {
      this.fetchLeaveTypes();
    }).catch(err => this.toastyService.error({ title: 'Error', msg: err }));
  }

  fetchLeaveTypes() {
    this.isEdit = false;
    this.leaveTypes.fetch().then(data => {
      this.leaveTypes.items.forEach((item: LeaveType) => {
        item.category = item.category || null;
      });
    }).catch(err => this.toastyService.error({ title: 'Error', msg: err }));
  }

  edit(leaveType: LeaveType) {
    this.leaveTypeModel = leaveType
    this.isEdit = true;
  }

  add() {
    this.leaveTypeModel = new LeaveType();
    this.isEdit = true
  }

  ngOnInit() {
  }

}
