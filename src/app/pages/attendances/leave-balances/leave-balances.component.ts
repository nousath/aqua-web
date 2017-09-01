import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ValidatorService, AmsLeaveService } from '../../../services';
import { ToastyService } from 'ng2-toasty';
import { Page } from '../../../common/contracts/page';
import { OrgLeaveBalance, LeaveType, LeaveBalance } from '../../../models';
import * as _ from 'lodash';
import { Model } from '../../../common/contracts/model';
import { Filter } from '../../../common/contracts/filters';
import { LocalStorageService } from "app/services/local-storage.service";

@Component({
  selector: 'aqua-leave-balances',
  templateUrl: './leave-balances.component.html',
  styleUrls: ['./leave-balances.component.css']
})
export class LeaveBalancesComponent implements OnInit {

  leaveBalances: Page<OrgLeaveBalance>;
  // leaveBalance: Model<OrgLeaveBalance>;
  leaveTypes: Page<LeaveType>;

  isFilter: boolean = false;

  constructor(public validatorService: ValidatorService,
    private amsLeaveService: AmsLeaveService,
    private store: LocalStorageService,
    private ref: ChangeDetectorRef,
    private toastyService: ToastyService) {

    this.leaveBalances = new Page({
      api: amsLeaveService.allLeaveBalances,
      filters: [{
        field: 'name',
        value: null
      }, {
        field: 'leaveType',
        value: null
      }]
    });

    // this.leaveBalance = new Model({
    //   api: amsLeaveService.updateLeaveBlances,
    //   properties: new OrgLeaveBalance()
    // });

    this.leaveTypes = new Page({
      api: amsLeaveService.leaveTypes
    });

    this.leaveTypes.fetch().catch(err => this.toastyService.error({ title: 'Error', msg: err }));
    this.fetchLeaveBalances();
  }


  fetchLeaveBalances() {
    // this.setFiltersToStore();
    this.leaveBalances.fetch().then(
      data => {
        _.each(this.leaveBalances.items, (emp: OrgLeaveBalance) => {
          let leaveBalnces: LeaveBalance[] = [];
          _.each(this.leaveTypes.items, (leaveType: LeaveType) => {
            let lb: LeaveBalance = _.find(emp.leaveBalances, (i: LeaveBalance) => {
              return i.leaveType.id === leaveType.id;
            });
            // lb ? leaveBalnces.push(lb) : leaveBalnces.push(new LeaveBalance());
            if (lb) {
              leaveBalnces.push(lb)
            } else {
              let newLb: LeaveBalance = new LeaveBalance();
              newLb.leaveType = leaveType;
              leaveBalnces.push(newLb)
            }
          });
          emp.leaveBalances = leaveBalnces;
          emp['isEdit'] = false
        })
      }
    ).catch(err => this.toastyService.error({ title: 'Error', msg: err }));
  }

  reset() {
    this.leaveBalances.filters.reset();
    // this.store.removeItem('leaveBalances-filters');
    this.fetchLeaveBalances();
  }

  // checkFiltersInStore() {
  //   let filters: any = this.store.getObject('leaveBalances-filters');
  //   if (filters) {
  //     // this.isFilter = true;
  //     this.leaveBalances.filters.properties['name']['value'] = filters['name'] || null;
  //   }
  //   this.fetchLeaveBalances();
  // }

  // setFiltersToStore() {
  //   let queryParams: any = {};
  //   _.each(this.leaveBalances.filters.properties, (filter: Filter, key: any, obj: any) => {
  //     if (filter.value) {
  //       queryParams[key] = filter.value;
  //     }
  //   })
  //   if (queryParams) {
  //     this.store.setObject('leaveBalances-filters', queryParams);
  //   }
  // }

  toggleLaveBalnce(leave: OrgLeaveBalance, isEdit: boolean) {
    if (isEdit) {
      leave.isEdit = true;
      this.store.setObject(`leeaveBalance_${leave.id}`, leave);
    } else {
      leave.isEdit = false;
      let l: OrgLeaveBalance = this.store.getObject(`leeaveBalance_${leave.id}`) as OrgLeaveBalance;
      leave.leaveBalances = l.leaveBalances;
      this.store.removeItem(`leeaveBalance_${leave.id}`);
    }
  }

  isUpdatingLeave: boolean = false;
  updateLeaveBalance(leave: OrgLeaveBalance) {
    this.isUpdatingLeave = true;

    this.amsLeaveService.updateLeaveBlances.update(leave.code, leave.leaveBalances, null).then(
      data => {
        this.isUpdatingLeave = false;
        leave.isEdit = false;
        this.store.removeItem(`leeaveBalance_${leave.id}`);
        this.fetchLeaveBalances();
      }
    ).catch(err => {
      this.isUpdatingLeave = false;
      this.toastyService.error({ title: 'Error', msg: err });
    });
  }

  ngOnInit() {
  }

}
