import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ValidatorService, AmsLeaveService, EmsAuthService } from '../../../services';
import { ToastyService } from 'ng2-toasty';
import { Location } from '@angular/common'
import { PagerModel } from '../../../common/ng-structures';
import { OrgLeaveBalance, LeaveType, LeaveBalance } from '../../../models';
import * as _ from 'lodash';
import { LocalStorageService } from '../../../services/local-storage.service';
import { MdDialog } from '@angular/material';
import { GetValueDialogComponent } from '../../../shared/components/get-value-dialog/get-value-dialog.component';

@Component({
  selector: 'aqua-leave-balances',
  templateUrl: './leave-balances.component.html',
  styleUrls: ['./leave-balances.component.css']
})
export class LeaveBalancesComponent implements OnInit {

  leaveBalances: PagerModel<OrgLeaveBalance>;
  // leaveBalance: DetailModel<OrgLeaveBalance>;
  leaveTypes: PagerModel<LeaveType>;
  isProcessing = false;
  isFilter = false;

  filterFields = [
    'name',
    'code',
    'designations',
    'supervisor',
    'departments',
    'userTypes',
    'contractors',
    'divisions'
  ]

  constructor(
    public validatorService: ValidatorService,
    private amsLeaveService: AmsLeaveService,
    public auth: EmsAuthService,
    private store: LocalStorageService,
    private location: Location,
    private ref: ChangeDetectorRef,
    private toastyService: ToastyService,
    public dialog: MdDialog
  ) {
    const divisionFilter = {
      field: 'divisions',
      value: null
    }
    const userDiv = this.auth.currentRole().employee.division
    if (userDiv && userDiv.name && userDiv.code && userDiv.code !== 'default') {
      divisionFilter.value = [userDiv.name]
    }

    this.leaveBalances = new PagerModel({
      api: amsLeaveService.allLeaveBalances,
      location: location,
      filters: ['name', 'code', 'designations', 'departments', 'supervisorId', 'userTypes', 'contractors', divisionFilter]
    });

    this.leaveTypes = new PagerModel({
      api: amsLeaveService.leaveTypes
    });

    this.leaveTypes.fetch().then(() => {
      this.fetchLeaveBalances();
    }).catch(err => this.toastyService.error({ title: 'Error', msg: err }));

  }

  applyFilters(result) {

    const filters = this.leaveBalances.filters.properties;
    const values = result.values
    filters['name']['value'] = values.employeeName;
    filters['code']['value'] = values.employeeCode;
    filters['departments']['value'] = values.departmentNames;
    filters['designations']['value'] = values.designationNames;
    filters['supervisorId']['value'] = values.supervisorId;
    filters['userTypes']['value'] = values.userTypeIds;
    filters['contractors']['value'] = values.contractorNames;
    filters['divisions']['value'] = values.divisionNames;
    this.fetchLeaveBalances();
  }

  grant(item: LeaveType) {
    const dialogRef = this.dialog.open(GetValueDialogComponent)
    const component = dialogRef.componentInstance;
    component.title = `Grant ${item.name}`
    component.showComment = true;
    component.type = 'number';
    component.value = 0;
    component.valueLabel = 'No of Days'

    dialogRef.afterClosed().subscribe((response: any) => {
      if (response === false) { return; }
      this.isProcessing = true;
      this.amsLeaveService.leaveBalances.simplePost({
        employees: {
          query: this.leaveBalances.filters.getQuery()
        },
        leaveType: {
          id: item.id
        },
        days: parseInt(response.value),
        journal: {
          comment: response.comment
        }
      }, `all/grant`).then(data => {
        this.isProcessing = false;
        this.fetchLeaveBalances();
      }).catch(err => {
        this.isProcessing = false;
        this.toastyService.error({ title: 'Error', msg: err });
      });
    });
  }


  fetchLeaveBalances() {
    this.leaveBalances.fetch().then(data => {
      this.leaveBalances.items.forEach((emp: OrgLeaveBalance) => {
        const leaveBalnces: LeaveBalance[] = [];
        _.each(this.leaveTypes.items, (leaveType: LeaveType) => {
          const lb: LeaveBalance = _.find(emp.leaveBalances, (i: LeaveBalance) => {
            return i.leaveType.id === leaveType.id;
          });
          // lb ? leaveBalnces.push(lb) : leaveBalnces.push(new LeaveBalance());
          if (lb) {
            leaveBalnces.push(lb)
          } else {
            const newLb: LeaveBalance = new LeaveBalance();
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

  toggleLaveBalnce(leave: OrgLeaveBalance, isEdit: boolean) {
    if (isEdit) {
      leave.isEdit = true;
      this.store.setObject(`leeaveBalance_${leave.id}`, leave);
    } else {
      leave.isEdit = false;
      const l: OrgLeaveBalance = this.store.getObject(`leeaveBalance_${leave.id}`) as OrgLeaveBalance;
      leave.leaveBalances = l.leaveBalances;
      this.store.removeItem(`leeaveBalance_${leave.id}`);
    }
  }

  // updateLeaveBalance(leave: OrgLeaveBalance) {
  //   this.isUpdatingLeave = true;

  //   this.amsLeaveService.updateLeaveBlances.update(leave.code, leave.leaveBalances, null).then(
  //     data => {
  //       this.isUpdatingLeave = false;
  //       leave.isEdit = false;
  //       this.store.removeItem(`leeaveBalance_${leave.id}`);
  //       this.fetchLeaveBalances();
  //     }
  //   ).catch(err => {
  //     this.isUpdatingLeave = false;
  //     this.toastyService.error({ title: 'Error', msg: err });
  //   });
  // }

  ngOnInit() {
  }

}
