import { Component, OnInit, Input } from '@angular/core';
import { LeaveType, Periodicity } from '../../../models';
import { AmsLeaveService } from '../../../services';
import { Model } from '../../../common/contracts/model';
import { ToastyService } from 'ng2-toasty/src/toasty.service';

@Component({
  selector: 'aqua-leave-type',
  templateUrl: './leave-type.component.html',
  styleUrls: ['./leave-type.component.css']
})
export class LeaveTypeComponent implements OnInit {
  leaveType: Model<LeaveType>;
  @Input() leave: LeaveType;
  isLoading = false;
  show = true;

  constructor(
    private amsLeaveService: AmsLeaveService,
    private toastyService: ToastyService
  ) {
    this.leaveType = new Model({
      api: amsLeaveService.leaveTypes,
      properties: new LeaveType()
    });
  }

  saveLeaveType() {
    if (!this.leaveType.properties.category)
      return this.toastyService.info({ title: 'Info', msg: 'Select category' });
    if (
      this.leaveType.properties.unlimited == null ||
      this.leaveType.properties.unlimited == undefined
    )
      return this.toastyService.info({
        title: 'Info',
        msg: 'Select Yes if user can take unlimited leaves otherwise select No'
      });
    if (!this.leaveType.properties.name)
      return this.toastyService.info({ title: 'Info', msg: 'Enter name' });
    if (!this.leaveType.properties.unitsPerDay)
      return this.toastyService.info({
        title: 'Info',
        msg: 'Select units per day'
      });

    const unlimited: any = 'true';
    this.leaveType.properties.unlimited =
      this.leaveType.properties.unlimited == unlimited ? true : false;
    this.isLoading = true;
    this.leaveType
      .save(data => {
        this.isLoading = false;
        this.toastyService.success({ title: 'Success' });
        this.show = false;
      })
      .then(() => {
        this.isLoading = false;
        this.show = false;
      })
      .catch(err => {
        this.isLoading = false;
        this.show = false;
        this.toastyService.error({ title: 'Error', msg: err });
      });
  }

  ngOnChanges() {
    this.show = true;

    if (!this.leave) {
      return (this.leaveType.properties = new LeaveType());
    }
    if (!this.leaveType) {
      this.leaveType.properties = new LeaveType();
    }
    this.leaveType.properties = this.leave;
    if (!this.leaveType.properties.periodicity) {
      this.leaveType.properties.periodicity = new Periodicity();
    }
    if (!this.leaveType.properties.carryForward) {
      this.leaveType.properties.carryForward = null;
    }
  }

  ngOnInit() {
    this.show = true;
    if (!this.leave) {
      this.leaveType.properties = new LeaveType();
    }
    if (!this.leaveType) {
      this.leaveType.properties = new LeaveType();
    }
  }
}
