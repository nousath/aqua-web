import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Page } from '../../../common/contracts/page';
import { Leave, Employee } from '../../../models';
import { AmsLeaveService, ValidatorService, AmsEmployeeService, AutoCompleteService } from '../../../services';
import { ToastyService } from 'ng2-toasty';
import { Model } from '../../../common/contracts/model';
import { LeaveBalance } from '../../../models/leave-balance';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, Observable } from 'rxjs/Rx';
import { Angulartics2 } from 'angulartics2';
declare var $: any;

@Component({
  selector: 'aqua-apply-leave',
  templateUrl: './apply-leave.component.html',
  styleUrls: ['./apply-leave.component.css']
})
export class ApplyLeaveComponent implements OnInit {

  leave: Model<Leave>;
  leaveBalances: Page<LeaveBalance>;
  employee: Model<Employee>;
  subscription: Subscription;
  isEmpId: boolean = false;
  duration: 'multi' | 'full' | 'half' | '1/3' | '2/3' | null = null;

  constructor(private amsEmployeeService: AmsEmployeeService,
    private amsLeaveService: AmsLeaveService,
    public validatorService: ValidatorService,
    private autoCompleteService: AutoCompleteService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastyService: ToastyService,
    private angulartics2: Angulartics2)
     {

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
        let empId = params['empId'];
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
  }

  onSelectEmp(emp: Employee) {
    if (emp.id)
      this.getLeaveBalance(emp.id);
  }

  empSource(keyword: string): Observable<Employee[]> {
    return this.autoCompleteService.searchByKey<Employee>('name', keyword, 'ams/api', 'employees');
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
        return i.leaveType.id == leaveTypeId
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

  applyLeave(isFormValid: boolean) {
    this.angulartics2.eventTrack.next({ action: 'applyLeaveClick', properties: { category: 'allLeave', label: 'myLabel' }});
    if (!isFormValid) {
      return this.toastyService.info({ title: 'Info', msg: 'Fill all required fields' })
    }
    this.leave.properties.date = new Date(this.leave.properties.date).toISOString();
    switch (this.duration) {
      case 'multi':
        let oneDay = 24 * 60 * 60 * 1000;
        let startDay: Date = new Date(this.leave.properties.date);
        startDay.setHours(0, 0, 0, 0);
        let endDay: Date = new Date(this.leave.properties.toDate);
        endDay.setHours(0, 0, 0, 0);
        if (endDay <= startDay) {
          return this.toastyService.info({ title: 'Info', msg: 'End Date should be greater then Start Date' })
        }
        this.leave.properties.days = Math.round(Math.abs((endDay.getTime() - startDay.getTime()) / (oneDay))) + 1;
        this.leave.properties.toDate = new Date(this.leave.properties.toDate).toISOString();
        break;
      case 'full':
        this.leave.properties.toDate = this.leave.properties.date;
        this.leave.properties.days = 1;
        break;
      case 'half':
        this.leave.properties.toDate = this.leave.properties.date;
        this.leave.properties.days = 1 / 2;
        break;
      case '1/3':
        this.leave.properties.toDate = this.leave.properties.date;
        this.leave.properties.days = 1 / 3;
        break;
      case '2/3':
        this.leave.properties.toDate = this.leave.properties.date;
        this.leave.properties.days = 2 / 3;
        break;
      default:
        return this.toastyService.info({ title: 'Info', msg: 'Select Duration' })
    }

    let totalLeaveBalace: LeaveBalance = this.leaveBalances.items.find((i: LeaveBalance) => {
      return i.leaveType.id == this.leave.properties.type.id
    });

    if (this.leave.properties.days > totalLeaveBalace.days && !totalLeaveBalace.leaveType.unlimited) {
      return this.toastyService.info({ title: 'Info', msg: `You don't have sufficent leave balance` })
    }

    this.leave.save().then(
      data => this.isEmpId ? this.router.navigate(['../'], { relativeTo: this.activatedRoute }) : this.router.navigate(['../../'], { relativeTo: this.activatedRoute })
    ).catch(err => this.toastyService.error({ title: 'Error', msg: err }));

  }


  initDatePiker(type: string) {
    setTimeout(() => {
      if (this.duration == 'multi') {
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

  ngOnInit() {
  }

}
