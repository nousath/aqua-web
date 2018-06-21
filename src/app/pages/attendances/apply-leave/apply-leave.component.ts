import { Component, OnInit, AfterViewInit, SimpleChanges, Output, EventEmitter, ViewChild } from '@angular/core';
import { Page } from '../../../common/contracts/page';
import { Leave, Employee, LeaveType } from '../../../models';
import { AmsLeaveService, ValidatorService, AmsEmployeeService, AutoCompleteService } from '../../../services';
import { Model } from '../../../common/contracts/model';
import { LeaveBalance } from '../../../models/leave-balance';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, Observable } from 'rxjs/Rx';
import { Angulartics2 } from 'angulartics2';
import { LocalStorageService } from '../../../services/local-storage.service';
import { ApplyLeaveTypeComponent } from '../apply-leave-type/apply-leave-type.component';
import { ToastyService } from 'ng2-toasty';
import { ServerPageInput } from '../../../common/contracts/api';
declare var $: any;

@Component({
  selector: 'aqua-apply-leave',
  templateUrl: './apply-leave.component.html',
  styleUrls: ['./apply-leave.component.css']
})
export class ApplyLeaveComponent {


  leaveBalances: LeaveBalance[];
  employee: Employee;
  leaves: Leave[] = [];
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
    private angulartics2: Angulartics2, ) {
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

  getLeaveBalance(employeeId: string) {
    const input = new ServerPageInput();
    input.serverPaging = false;
    input.query = {
      id: employeeId,
      employeeId: employeeId
    };
    this.amsLeaveService.leaveBalances.search(input)
      .then(page => this.leaveBalances = page.items)
      .catch(err => this.toastyService.error({ title: 'Error', msg: err }));
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
    if (this.employee) {
      this.getLeaveBalance(this.employee.id);
    }
  }

  onLeaveCreate(item: Leave, index: number) {
    this.leaves.push(item)
  }

  applyLeave(isFormValid: boolean) {
    this.angulartics2.eventTrack.next({ action: 'applyLeaveClick', properties: { category: 'allLeave', label: 'myLabel' } });
    if (!isFormValid) {
      return this.toastyService.info({ title: 'Info', msg: 'Fill all required fields' })
    }

    // this.bulkLeaves.forEach((item: any) => {
    //   this.leave.properties.id = this.bulkLeaves.
    //   this.leave.save().then(
    //     data => this.isEmpId ? this.router.navigate(['../'], { relativeTo: this.activatedRoute }) : this.router.navigate(['../../'], { relativeTo: this.activatedRoute })
    //   ).catch(err => this.toastyService.error({ title: 'Error', msg: err }));

    // })
    // this.apply.approveLeave();

    // this.leave.save().then(
    //   data => this.isEmpId ? this.router.navigate(['../'], { relativeTo: this.activatedRoute }) : this.router.navigate(['../../'], { relativeTo: this.activatedRoute })
    // ).catch(err => this.toastyService.error({ title: 'Error', msg: err }));

    // })

  }
}
