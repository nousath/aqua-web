import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AmsLeaveService } from '../../../services/ams';
import { ValidatorService } from '../../../services/validator.service';
import { ToastyService } from 'ng2-toasty';
import { Page } from '../../../common/contracts/page';
import { Leave } from '../../../models';
import { LeaveActionDialogComponent } from '../../../dialogs/leave-action-dialog/leave-action-dialog.component';
import { MdDialog } from '@angular/material';
import { Filter } from '../../../common/contracts/filters';
import * as _ from "lodash";
import { LocalStorageService } from "../../../services/local-storage.service";
import { Angulartics2 } from 'angulartics2';
import { ConfirmDialogComponent } from '../../../dialogs/confirm-dialog/confirm-dialog.component';
import { LeaveConfirmDialogComponent } from '../../../dialogs/leave-confirm-dialog/leave-confirm-dialog.component';
declare var $: any;

@Component({
  selector: 'aqua-leaves',
  templateUrl: './leaves.component.html',
  styleUrls: ['./leaves.component.css']
})
export class LeavesComponent implements OnInit, AfterViewInit {

  leaves: Page<Leave>;
  isFilter: boolean = false;
  isShowLeaveAction: boolean = false;
  date: Date = null
  userType: string = ''
  select: boolean = false



  constructor(public validatorService: ValidatorService,
    private amsLeaveService: AmsLeaveService,
    public dialog: MdDialog,
    private store: LocalStorageService,
    private toastyService: ToastyService,
    private angulartics2: Angulartics2) {

      this.userType = store.getItem('userType');
      
    if(this.userType == 'admin'){
    this.leaves = new Page({
      api: amsLeaveService.teamLeaves,
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
  }
  if(this.userType == 'superadmin'){
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
  }
    this.checkFiltersInStore();
  }

  
  fetchLeaves(date?: Date) {
    this.setFiltersToStore();



    this.leaves.fetch().then(
      data => {
        let i: any = this.leaves.items.find((item: Leave) => {
          return item.status.toLowerCase() == 'submitted'
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
    let filters: any = this.store.getObject('leaves-filters');
    if (filters) {
      this.isFilter = true;
      this.leaves.filters.properties['status']['value'] = filters['status'] || null;
      this.leaves.filters.properties['name']['value'] = filters['name'] || null;
    }
    this.fetchLeaves();
  }

  setFiltersToStore() {
    let queryParams: any = {};
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
    let newdays = days ? Math.abs(days - 1) : 0;
    let newDate = date ? new Date(date) : null;
    if (newDate) { newDate.setDate(newDate.getDate() + newdays); }
    return date ? newDate : null;

  }

  isUpdatingLeaveStatus: boolean = false;
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
      let dialogRef = this.dialog.open(LeaveActionDialogComponent, {
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
       let date = new Date(e.date);
        this.leaves.filters.properties['date']['value'] = date.toISOString();
      }
      // this.fetchLeaves(e.date);
    });
    // $("#monthSelector").datepicker("setDate", null);
  }
  selectAll(){
    if(this.select == true)
        this.select = false;
        else
        this.select = true;
  }
  ApproveLeave(){
    let dialog = this.dialog.open(LeaveConfirmDialogComponent, { width: '40%' });
  }

  ngOnInit() {
  }

}
