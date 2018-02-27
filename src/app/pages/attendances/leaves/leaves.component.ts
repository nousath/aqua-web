import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AmsLeaveService } from '../../../services/ams';
import { ValidatorService } from '../../../services/validator.service';
import { ToastyService } from 'ng2-toasty';
import { Page } from '../../../common/contracts/page';
import { Leave } from '../../../models';
import { LeaveActionDialogComponent } from '../../../dialogs/leave-action-dialog/leave-action-dialog.component';
import { MdDialog } from '@angular/material';
import { Filter } from '../../../common/contracts/filters';
import * as _ from 'lodash';
import { LocalStorageService } from '../../../services/local-storage.service';
import { Angulartics2 } from 'angulartics2';
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



  constructor(public validatorService: ValidatorService,
    private amsLeaveService: AmsLeaveService,
    public dialog: MdDialog,
    private store: LocalStorageService,
    private toastyService: ToastyService,
    private angulartics2: Angulartics2) {

    this.leaves = new Page({
      api: amsLeaveService.allLeavesOfOrg,
      filters: [{
        field: 'name',
        value: null
      }, {
        field: 'status',
        value: null
      }, {
        field: 'date',
        value: null
      }]
    });
    this.checkFiltersInStore();
  }

  fetchLeaves(date?: Date) {
    this.setFiltersToStore();



    this.leaves.fetch().then(
      data => {
        const i: any = this.leaves.items.find((item: Leave) => {
          return item.status.toLowerCase() === 'submitted'
        });
        if (i)
          this.isShowLeaveAction = true;

      }
    ).catch(err => this.toastyService.error({ title: 'Error', msg: err }));
  }

  reset() {
    this.leaves.filters.reset();
    this.store.removeItem('leaves-filters')
    this.fetchLeaves();
  }

  checkFiltersInStore() {
    const filters: any = this.store.getObject('leaves-filters');
    if (filters) {
      this.isFilter = true;
      this.leaves.filters.properties['status']['value'] = filters['status'] || null;
      this.leaves.filters.properties['name']['value'] = filters['name'] || null;
    }
    this.fetchLeaves();
  }

  setFiltersToStore() {
    const queryParams: any = {};
    _.each(this.leaves.filters.properties, (filter: Filter, key: any, obj: any) => {
      if (filter.value) {
        queryParams[key] = filter.value;
      }
    })
    if (queryParams) {
      this.store.setObject('leaves-filters', queryParams);
    }
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

  isUpdatingLeaveStatus = false;
  updateStatus(leave: Leave) {
    this.isUpdatingLeaveStatus = true;
    this.amsLeaveService.leaves.update(leave.id, leave, null, `${leave.id}/action`).then(
      data => {
        this.isUpdatingLeaveStatus = false;
        this.fetchLeaves();
      }
    ).catch(err => {
      this.isUpdatingLeaveStatus = false;
      this.toastyService.error({ title: 'Error', msg: err });
    });
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

  ngOnInit() {
  }

}
