import { Component, OnInit, Input } from '@angular/core';
import { Employee } from '../../../models/employee';
import { AmsEmployeeService, AmsLeaveService } from '../../../services/index';
import { LeaveBalance } from '../../../models/index';
import { Page } from '../../../common/contracts/page';
import { ServerPageInput } from '../../../common/contracts/api/index';
import { ToastyService } from 'ng2-toasty';

@Component({
  selector: 'aqua-emp-leaves',
  templateUrl: './emp-leaves.component.html',
  styleUrls: ['./emp-leaves.component.css']
})
export class EmpLeavesComponent implements OnInit {
  @Input() code: string;
  employee: Employee = new Employee();
  leaveBalances: LeaveBalance[];
  isEdit: boolean = false

  constructor(
    private amsEmployeeService: AmsEmployeeService,
    private amsLeaveService: AmsLeaveService,
    private toastyService: ToastyService
  ) {
    // this.leaveBalances = new Page({
    //   api: amsLeaveService.leaveBalances,
    //   // filters: [{
    //   //   field: 'id',
    //   //   value: null
    //   // }]
    // });
  }

  ngOnInit() {
  }
  ngOnChanges() {
    if (this.code) {
      this.getAmsDetails();
    }
  }

  getAmsDetails() {
    this.amsEmployeeService.employees
      .get(this.code)
      .then(amsEmployee => {
        this.employee = amsEmployee;
        this.getLeaveBalance(this.employee.id)

      });
  }

  reset() {
    this.isEdit = false,
      this.getLeaveBalance(this.employee.id)
  }
  getLeaveBalance(employeeId: string) {
    const input = new ServerPageInput();
    input.serverPaging = false;
    input.query = {
      id: employeeId,
      employeeId: employeeId
    };
    this.amsLeaveService.leaveBalances.search(input).then(page => {
      this.leaveBalances = page.items;
    })
  }

  updateLeaveBalance(leaves: LeaveBalance) {
    this.amsLeaveService.leaveBalances.update(this.employee.id, leaves).then(
      data => {
        this.getLeaveBalance(this.employee.id)
      }
    ).catch(err => {
      this.toastyService.error({ title: 'Error', msg: err });
    });
  }

  toggleLaveBalnce(isEdit: boolean) {
    if (isEdit) {
      isEdit = true;
    } else {
      isEdit = false;
    }
  }



}
