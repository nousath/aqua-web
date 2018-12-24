import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AmsLeaveService } from '../../../services/ams';
import { ValidatorService } from '../../../services/validator.service';
import { ToastyService } from 'ng2-toasty';
import { Page } from '../../../common/contracts/page';
import { Leave } from '../../../models';
import { LeaveActionDialogComponent } from '../../../dialogs/leave-action-dialog/leave-action-dialog.component';
import { MdDialog, MdDialogRef } from '@angular/material';
import { Filter } from '../../../common/contracts/filters';
import * as _ from 'lodash';
import { Angulartics2 } from 'angulartics2';
import { ConfirmDialogComponent } from '../../../dialogs/confirm-dialog/confirm-dialog.component';
import { LeaveConfirmDialogComponent } from '../../../dialogs/leave-confirm-dialog/leave-confirm-dialog.component';
import { FileUploaderDialogComponent } from '../../../shared/components/file-uploader-dialog/file-uploader-dialog.component';
import { EmsAuthService } from '../../../services';
declare var $: any;

@Component({
  selector: 'aqua-leaves',
  templateUrl: './leaves.component.html',
  styleUrls: ['./leaves.component.css']
})
export class LeavesComponent implements OnInit, AfterViewInit {

  leaves: Page<Leave>;
  isFilter = false;
  isShowLeaveAction = false;
  date: Date = null
  userType = ''
  select = false;
  Selected = [];
  check = false;

  isUpdatingLeaveStatus = false;




  constructor(public validatorService: ValidatorService,
    private amsLeaveService: AmsLeaveService,
    public dialog: MdDialog,
    public auth: EmsAuthService,
    private toastyService: ToastyService,
    private angulartics2: Angulartics2) {

    let filters = []
    if (this.auth.hasPermission(['admin', 'superadmin'])) {
      filters = [{
        field: 'name',
        value: null
      }, {
        field: 'status',
        value: null
      }, {
        field: 'date',
        value: null
      }];
    }

    this.leaves = new Page({
      api: amsLeaveService.teamLeaves,
      filters: filters
    });
    this.fetchLeaves();
  }
  fetch() {
    this.check = false;
    this.Selected = [];
    this.fetchLeaves();
  }

  fetchLeaves(date?: Date) {
    this.leaves.fetch().then(data => {
      const i: any = this.leaves.items.find((item: Leave) => {
        return item.status.toLowerCase() === 'submitted'
      });
      if (i)
        this.isShowLeaveAction = true;
    }).catch(err => this.toastyService.error({ title: 'Error', msg: err }));
  }

  reset() {
    this.leaves.filters.reset();
    this.fetchLeaves();
  }

  setDate(date: Date, days: number): Date {
    if (days && days < 1) {
      days = 1;
    }
    const newdays = days ? Math.abs(days - 1) : 0;
    const newDate = date ? new Date(date) : null;
    if (newDate) { newDate.setDate(newDate.getDate() + newdays); }
    return date ? newDate : null;

  }

  updateStatus(leave: Leave) {
    this.isUpdatingLeaveStatus = true;
    this.amsLeaveService.leaves.update(leave.id, leave, null, `${leave.id}/action`).then(data => {
      this.isUpdatingLeaveStatus = false;
      this.fetchLeaves();
    }).catch(err => {
      this.isUpdatingLeaveStatus = false;
      this.toastyService.error({ title: 'Error', msg: err });
    });
  }
  allLeaves(item: string) {
    if (this.Selected.includes(item)) {
      const i = this.Selected.indexOf(item)
      this.Selected.splice(i, 1);
    } else {
      this.Selected.push(item);
    }
  }
  addLeaves(item: string) {
    if (this.Selected.includes(item)) {
      console.log(this.Selected)
    } else {
      this.Selected.push(item);
      console.log(this.Selected)
    }
  }

  approveLeaves(status: string) {
    if (status === 'approved') {
      this.Selected.forEach((item: any) => {
        item.status = status;
        this.updateStatus(item);
        this.Selected = [];
      })
    } else {

      const dialogRef = this.dialog.open(LeaveActionDialogComponent, {
        width: '35%'
      });

      dialogRef.afterClosed().subscribe((reason: string) => {
        this.Selected.forEach((item: any) => {
          if (reason) {
            item.comment = reason;
            item.status = status;
            this.updateStatus(item)
          }
          item.status = status;
          this.updateStatus(item);
        });
        this.Selected = [];

      })
    }
  }

  accept_reject_leave(leave: Leave, status: string) {

    if (status !== 'rejected') {
      leave.status = status;
      this.updateStatus(leave);
      this.angulartics2.eventTrack.next({ action: 'approveLeaveClick', properties: { category: 'allLeave', label: 'myLabel' } });

    } else {
      this.angulartics2.eventTrack.next({ action: 'rejectLeaveClick', properties: { category: 'allLeave', label: 'myLabel' } });
      const dialogRef = this.dialog.open(LeaveActionDialogComponent, {
        width: '35%'
      });

      dialogRef.afterClosed().subscribe((reason: string) => {
        if (reason) {
          leave.comment = reason;
          leave.status = status;
          this.updateStatus(leave)
        }
      });
    }
  }

  ngAfterViewInit() {

    $('#monthSelector').datepicker({
      format: 'M, yy',
      minViewMode: 1,
      maxViewMode: 2,
      autoclose: true
    }).on('changeMonth', (e) => {
      if (e.date) {
        this.date = e.date;
        const date = new Date(e.date);
        this.leaves.filters.properties['date']['value'] = date.toISOString();
      }
      // this.fetchLeaves(e.date);
    });
    // $("#monthSelector").datepicker("setDate", null);
  }
  selectAll() {
    this.select = !this.select;
  }

  ngOnInit() {
  }
  All() {
    if (this.Selected.length === this.leaves.items.length) {
      this.Selected = [];
      this.check = false;
      console.log(this.Selected)
    } else if (this.Selected.length !== this.leaves.items.length) {
      this.leaves.items.forEach((item: any) => {
        if (item.status === 'submitted') {
          this.addLeaves(item)
          this.check = true;
        }
      })
    } else {
      this.leaves.items.forEach((item: any) => {
        if (item.status === 'submitted') {
          this.allLeaves(item)
          this.check = true;
        }
      })
    }
  }
  import() {
    const dialogRef: MdDialogRef<FileUploaderDialogComponent> = this.dialog.open(FileUploaderDialogComponent);
    const component = dialogRef.componentInstance;
    component.uploader = this.amsLeaveService.leaves;
    component.samples = [{
      name: 'CSV/Excel',
      mapper: 'default',
      url_csv: 'assets/formats/leaves.csv',
      url_xlsx: 'assets/formats/leaves.xlsx'
      // }, {
      //   name: 'EXCEL',
      //   mapper: 'default',
      //   url: 'assets/formats/leaves.csv'
    }];

    // component.mappers = [{
    //   name: 'Default',
    //   value: 'default'
    // }, {
    //   name: 'Zoho',
    //   value: 'zoho'
    // }, {
    //   name: 'Edualaya',
    //   value: 'edu'
    // }]
    component.name = 'Leaves';
    dialogRef.afterClosed().subscribe();
  }

}
