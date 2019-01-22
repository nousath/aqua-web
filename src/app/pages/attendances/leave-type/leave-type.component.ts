import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LeaveType, Periodicity } from '../../../models';
import { AmsLeaveService } from '../../../services';
import { DetailModel } from '../../../common/ng-structures';
import { ToastyService } from 'ng2-toasty/src/toasty.service';

@Component({
  selector: 'aqua-leave-type',
  templateUrl: './leave-type.component.html',
  styleUrls: ['./leave-type.component.css']
})
export class LeaveTypeComponent implements OnInit {
  @Input()
  leaveType: LeaveType;

  model: LeaveType;

  @Output()
  onUpdate: EventEmitter<LeaveType> = new EventEmitter();

  @Output()
  onCreate: EventEmitter<LeaveType> = new EventEmitter();

  @Output()
  onCancel: EventEmitter<boolean> = new EventEmitter();

  yearlyCapping = true;

  isLoading = false;

  constructor(
    private amsLeaveService: AmsLeaveService,
    private toastyService: ToastyService
  ) {
  }

  save() {
    if (!this.model.category)
      return this.toastyService.info({ title: 'Info', msg: 'Select category' });

    if (this.model.unlimited === null || this.model.unlimited === undefined)
      return this.toastyService.info({
        title: 'Info',
        msg: 'Select Yes if user can take unlimited leaves otherwise select No'
      });

    if (!this.model.name)
      return this.toastyService.info({ title: 'Info', msg: 'Enter name' });

    if (!this.model.unitsPerDay)
      return this.toastyService.info({
        title: 'Info',
        msg: 'Select min per day'
      });




    this.isLoading = true;

    (this.model.id ? this.amsLeaveService.leaveTypes.update(this.model.id, this.model) : this.amsLeaveService.leaveTypes.create(this.model))
      .then(data => {
        this.isLoading = false;
        this.toastyService.success({ title: 'Success' });
        (this.model.id ? this.onUpdate : this.onCreate).emit(this.model)
      })
      .catch(err => {
        this.isLoading = false;
        this.toastyService.error({ title: 'Error', msg: err });
      });
  }

  remove() {
    this.amsLeaveService.leaveTypes.remove(this.model.id).then(data => {
      this.isLoading = false;
      this.toastyService.success({ title: 'Success' });
      this.onUpdate.emit(this.model)
    })
      .catch(err => {
        this.isLoading = false;
        this.toastyService.error({ title: 'Error', msg: err });
      });
  }

  onYearlyCappingToggled() {
    this.yearlyCapping = !this.yearlyCapping
    if (!this.yearlyCapping) {
      this.model.carryForward = null;
    }
  }

  setUnlimited(value: boolean) {
    this.model.unlimited = value;

    if (this.model.unlimited) {
      this.yearlyCapping = false;
      this.model.periodicity = new Periodicity();
      this.model.days = null;
      this.model.carryForward = null;
    }
  }

  cancel() {
    this.onCancel.emit(false)
  }

  ngOnChanges() {

    if (!this.leaveType) {
      this.model = new LeaveType();
      this.model.periodicity = new Periodicity();
      return
    }

    this.model = JSON.parse(JSON.stringify(this.leaveType))


    if (this.model.carryForward === undefined || this.model.carryForward === null) {
      this.yearlyCapping = false;
    }

  }

  ngOnInit() {
    this.ngOnChanges()
  }
}
