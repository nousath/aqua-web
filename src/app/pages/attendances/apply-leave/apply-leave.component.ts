import { Component, OnInit, AfterViewInit, SimpleChanges, Output, EventEmitter, ViewChild } from '@angular/core';
import { PagerModel } from '../../../common/ng-structures';
import { Leave, Employee, LeaveType } from '../../../models';
import { AmsLeaveService, ValidatorService, AmsEmployeeService, AutoCompleteService } from '../../../services';
import { DetailModel } from '../../../common/ng-structures';
import { LeaveBalance } from '../../../models/leave-balance';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, Observable } from 'rxjs/Rx';
import { Angulartics2 } from 'angulartics2';
import { LocalStorageService } from '../../../services/local-storage.service';
import { Location } from '@angular/common';
import { ToastyService } from 'ng2-toasty';
import { PageOptions } from '../../../common/ng-api';
import { MdDialogRef, MdDialog } from '@angular/material';
import { FileUploaderDialogComponent } from '../../../shared/components/file-uploader-dialog/file-uploader-dialog.component';
declare var $: any;

@Component({
  selector: 'aqua-apply-leave',
  templateUrl: './apply-leave.component.html',
  styleUrls: ['./apply-leave.component.css']
})
export class ApplyLeaveComponent {


  leaveBalances: LeaveBalance[];
  employee: Employee;
  leaves: Map<number, Leave> = new Map();
  reason: string;
  isProcessing = false;

  employeeSelector = false;

  userType: any;



  constructor(private amsEmployeeService: AmsEmployeeService,
    private amsLeaveService: AmsLeaveService,
    public validatorService: ValidatorService,
    private autoCompleteService: AutoCompleteService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private store: LocalStorageService,
    private toastyService: ToastyService,
    private angulartics2: Angulartics2,
    public dialog: MdDialog,
    public _location: Location
  ) {
    this.userType = this.store.getItem('userType');



    activatedRoute.params.subscribe(params => {
      const employeeId = params['employeeId'] || params['empId'];
      if (!employeeId) {
        this.employeeSelector = true;
        return;
      }
      this.employeeSelector = false;

      this.getLeaveBalance(employeeId);

      this.amsEmployeeService.employeesForAdmin
        .get(employeeId)
        .then(employee => this.employee = employee)
        .catch(err => this.toastyService.error({ title: 'Error', msg: err }));
    });
  }

  errorHandler = (err) => {
    this.isProcessing = false;
    this.toastyService.error({ title: 'Error', msg: err })
  }

  getLeaveBalance(employeeId: string) {
    this.isProcessing = true;
    const input = new PageOptions();
    input.noPaging = true;
    input.query = {
      id: employeeId,
      employeeId: employeeId
    };
    this.amsLeaveService.leaveBalances.search(input).then(page => {
      this.leaveBalances = page.items;
      this.isProcessing = false;
    }).catch(this.errorHandler);
  }

  onSelectEmp(employee: Employee) {
    this.employee = employee;
    if (employee.id) {
      this.getLeaveBalance(employee.id);
    }
  }

  empSource(keyword: string): Observable<Employee[]> {
    return this.autoCompleteService.searchByKey<Employee>('name', keyword, 'ams', 'employees');
  }

  empFormatter(data: Employee): string {
    return data.name;
  }

  empListFormatter(data: Employee): string {
    return `${data.name} (${data.code})`;
  }

  reset() {
    this.leaves = new Map();
    this.reason = '';

    if (this.employeeSelector) {
      this.employee = null;
      this.leaveBalances = null;
    } else if (this.employee) {
      this.getLeaveBalance(this.employee.id);
    }
  }

  onLeaveCreate(item: Leave, index: number) {
    this.leaves[index] = item;
  }

  applyLeave() {
    if (!this.reason) {
      return this.toastyService.error({ title: 'Error', msg: 'Please add a reason' })
    }
    const items: Leave[] = [];
    Object.keys(this.leaves).forEach(key => {
      const item = this.leaves[key] as Leave;
      if (item) {
        item.reason = this.reason;
        items.push(item)
      }
    });

    if (!items.length) {
      return this.toastyService.error({ title: 'Error', msg: 'No Leaves Selected' })
    }

    this.angulartics2.eventTrack.next({ action: 'applyLeaveClick', properties: { category: 'allLeave', label: 'myLabel' } });

    this.amsLeaveService.leaves.bulkCreate(items).then(() => {
      this.isProcessing = false;
      this.toastyService.info({ title: 'Processed', msg: `${items.length} leave(s) applied` })
      this.reset()
    }).catch(this.errorHandler);
  }

  backClicked() {
    this._location.back();
  }
}
