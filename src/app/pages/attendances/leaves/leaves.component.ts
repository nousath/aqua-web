import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AmsLeaveService } from '../../../services/ams';
import { ValidatorService } from '../../../services/validator.service';
import { ToastyService } from 'ng2-toasty';
import { PagerModel } from '../../../common/ng-structures';
import { Leave } from '../../../models';
import { LeaveActionDialogComponent } from '../../../dialogs/leave-action-dialog/leave-action-dialog.component';
import { MdDialog, MdDialogRef } from '@angular/material';
import * as _ from 'lodash';
import { Angulartics2 } from 'angulartics2';
import { ConfirmDialogComponent } from '../../../dialogs/confirm-dialog/confirm-dialog.component';
import { LeaveConfirmDialogComponent } from '../../../dialogs/leave-confirm-dialog/leave-confirm-dialog.component';
import { FileUploaderDialogComponent } from '../../../shared/components/file-uploader-dialog/file-uploader-dialog.component';
import { EmsAuthService } from '../../../services';
import * as moment from 'moment';
import { appInitializerFactory } from '@angular/platform-browser/src/browser/server-transition';
declare var $: any;

@Component({
  selector: 'aqua-leaves',
  templateUrl: './leaves.component.html',
  styleUrls: ['./leaves.component.css']
})
export class LeavesComponent implements OnInit, AfterViewInit {

  leaves: PagerModel<Leave>;
  isFilter = false;
  bulkActions = false;
  date = new Date();
  select = false;
  selected = [];
  allSelected = false;

  isProcessing = false;

  constructor(public validatorService: ValidatorService,
    private amsLeaveService: AmsLeaveService,
    public dialog: MdDialog,
    public auth: EmsAuthService,
    private toastyService: ToastyService,
    private angulartics2: Angulartics2) {

    const filters = ['date', 'status', 'name']

    this.leaves = new PagerModel({
      api: this.auth.hasPermission('superadmin') ? amsLeaveService.leaves : amsLeaveService.teamLeaves,
      filters: filters
    });
    this.fetchLeaves();
  }
  fetch() {
    this.selected = [];
    this.fetchLeaves();
  }

  fetchLeaves() {
    this.selected = [];
    this.allSelected = false;
    this.leaves.filters.properties['date']['value'] = this.date.toISOString();
    this.isProcessing = true
    this.leaves.fetch().then(data => {
      this.bulkActions = !!this.leaves.items.length
      this.leaves.items.forEach((item: Leave) => {
        if (item.status.toLowerCase() !== 'submitted') {
          this.bulkActions = false
        }
      });
      this.isProcessing = false
    }).catch(err => {
      this.isProcessing = false;
      this.toastyService.error({ title: 'Error', msg: err })
    });
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

  showNextMonth() {
    this.date = moment(this.date).add(1, 'month').toDate();
    $('#monthSelector').datepicker('setDate', this.date);
    this.fetchLeaves();
  }

  showPreviousMonth() {
    this.date = moment(this.date).subtract(1, 'month').toDate();
    $('#monthSelector').datepicker('setDate', this.date);
    this.fetchLeaves();
  }

  updateStatus(leave: Leave) {
    this.isProcessing = true;
    this.amsLeaveService.leaves.update(leave.id, leave, null, `${leave.id}/action`).then(data => {
      this.isProcessing = false;
      this.fetchLeaves();
    }).catch(err => {
      this.isProcessing = false;
      this.toastyService.error({ title: 'Error', msg: err });
    });
  }

  toggleLeaveSelection(item: Leave) {
    if (this.selected.includes(item.id)) {
      const i = this.selected.indexOf(item)
      this.selected.splice(i, 1);
      item.isSelected = false;
    } else {
      this.selected.push(item);
      item.isSelected = true;
    }
  }

  approveLeaves(status: string) {
    if (status === 'approved') {
      this.selected.forEach((item: any) => {
        item.status = status;
        this.updateStatus(item);
        this.selected = [];
      })
    } else {

      const dialogRef = this.dialog.open(LeaveActionDialogComponent, {
        width: '35%'
      });

      dialogRef.afterClosed().subscribe((reason: string) => {
        this.selected.forEach((item: any) => {
          if (reason) {
            item.comment = reason;
            item.status = status;
            this.updateStatus(item)
          }
          item.status = status;
          this.updateStatus(item);
        });
        this.selected = [];

      })
    }
  }

  setStatus(leave: Leave, status: string) {

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
        this.date = new Date(e.date);
        this.fetchLeaves()
      }
    });
  }

  ngOnInit() {
    this.date = moment().startOf('month').toDate()
  }
  selectAll() {
    if (this.selected.length === this.leaves.items.length) {
      this.selected = [];
      this.allSelected = false;
    } else if (this.selected.length !== this.leaves.items.length) {
      this.selected = [];
      this.leaves.items.forEach((item: any) => {
        this.selected.push(item.id)
      })
      this.allSelected = true;
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

    component.name = 'Leaves';
    dialogRef.afterClosed().subscribe();
  }

}
