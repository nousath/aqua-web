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
import { leave } from '@angular/core/src/profile/wtf_impl';
import { element } from 'protractor';
declare var $: any;

@Component({
  selector: 'aqua-apply-leave',
  templateUrl: './apply-leave.component.html',
  styleUrls: ['./apply-leave.component.css']
})
export class ApplyLeaveComponent {

  leave: Model<Leave>;
  leavetype: Model<LeaveType>;

  leaveBalances: Page<LeaveBalance>;
  employee: Model<Employee>;
  subscription: Subscription;
  user: string;
  isEmpId = false;
  duration: 'multi' | 'full' | 'half' | '1/3' | '2/3' | null = null;
  bulkLeaves: {
    id: string;
    start: string;
    end: string;
    type: string;
    days: number;
  }[]

  @ViewChild(ApplyLeaveTypeComponent) private apply: ApplyLeaveTypeComponent
  constructor(private amsEmployeeService: AmsEmployeeService,
    private amsLeaveService: AmsLeaveService,
    public validatorService: ValidatorService,
    private autoCompleteService: AutoCompleteService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private store: LocalStorageService,
    private toastyService: ToastyService,
    private angulartics2: Angulartics2, ) {
    this.user = this.store.getItem('userType');

    this.employee = new Model({
      api: amsEmployeeService.employeesForAdmin,
      properties: new Employee()
    });

    this.leaveBalances = new Page({
      api: amsLeaveService.leaveBalances,
      filters: [{
        field: 'id',
        value: null
      }]
    });

    this.leave = new Model({
      api: amsLeaveService.leaves,
      properties: new Leave()
    });

    this.subscription = activatedRoute.params.subscribe(
      params => {
        const empId = params['empId'];
        if (empId) {
          this.isEmpId = true;
          this.getLeaveBalance(empId);
          this.employee.fetch(empId).then(
            data => {
              this.leave.properties.employee = this.employee.properties;
            }
          ).catch(err => this.toastyService.error({ title: 'Error', msg: err }));
        }
      }
    );
  }


  getLeaveBalance(empId: string) {
    this.leaveBalances.filters.properties['id'].value = empId;
    this.leaveBalances.fetch().catch(err => this.toastyService.error({ title: 'Error', msg: err }));
    console.log(this.leaveBalances)
  }

  onSelectEmp(emp: Employee) {
    if (emp.id)
      this.getLeaveBalance(emp.id);
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

  selectLeveType(leaveTypeId: string) {
    if (leaveTypeId)
      this.leave.properties.leaveType.unitsPerDay = this.leaveBalances.items.find((i: LeaveBalance) => {
        return i.leaveType.id === leaveTypeId
      }).leaveType.unitsPerDay;
    else
      this.leave.properties.leaveType.unitsPerDay = null;
  }

  reset() {
    this.leave.properties = new Leave();
    if (this.isEmpId) {
      this.leave.properties.employee = this.employee.properties;
    }
  }

  allLeaves(item: any) {

    this.bulkLeaves = this.bulkLeaves.filter(element => element.id !== item.id)
    this.bulkLeaves.push(item)
    console.log(this.bulkLeaves)
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


  initDatePiker(type: string) {
    setTimeout(() => {
      if (this.duration === 'multi') {
        this.initMultiDatePiker()
      } else {
        this.initOneDayDatePiker()
      }
    }, 1000);

  }

  initMultiDatePiker() {
    $('#startDate1').datepicker({
      format: 'dd/mm/yyyy',
      minViewMode: 0,
      maxViewMode: 2,
      autoclose: true
    }).on('changeDate', (e) => {
      this.leave.properties.date = e.date;
    });
  }

  initOneDayDatePiker() {
    $('#startDate').datepicker({
      format: 'dd/mm/yyyy',
      minViewMode: 0,
      maxViewMode: 2,
      autoclose: true
    }).on('changeDate', (e) => {
      this.leave.properties.date = e.date;
    });

    $('#endDate').datepicker({
      format: 'dd/mm/yyyy',
      minViewMode: 0,
      maxViewMode: 2,
      autoclose: true
    }).on('changeDate', (e) => {
      this.leave.properties.toDate = e.date;
    });
  }

}
