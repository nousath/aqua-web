import { Component, OnInit, Input } from '@angular/core';
import { Employee } from '../../../models/employee';
import { AmsEmployeeService, AmsLeaveService } from '../../../services/index';
import { LeaveBalance } from '../../../models/index';
import { Page } from '../../../common/contracts/page';
import { ServerPageInput } from '../../../common/contracts/api/index';

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

  ) {
    // this.leaveBalances = new Page({
    //   api: amsLeaveService.leaveBalances,
    //   // filters: [{
    //   //   field: 'id',
    //   //   value: null
    //   // }]
    // });
    console.log(this.leaveBalances)
  }

  ngOnInit() {
  }
  ngOnChanges() {
    if (this.code) {
      console.log(this.code)
      this.getAmsDetails();
    }
  }

  getAmsDetails() {
    this.amsEmployeeService.employees
      .get(this.code)
      .then(amsEmployee => {
        this.employee = amsEmployee;
        console.log(this.employee)
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
      console.log(this.leaveBalances)
    })
  }

  updateLeaveBalance(leaves: LeaveBalance) {
    this.amsLeaveService.leaveBalances.update(this.employee.id, leaves)
    console.log(leaves)
    console.log(this.leaveBalances)
  }

  toggleLaveBalnce(isEdit: boolean) {
    if (isEdit) {
      isEdit = true;
      // this.store.setObject(`leeaveBalance_${leave.id}`, leave);
    } else {
      isEdit = false;
      // const l: OrgLeaveBalance = this.store.getObject(`leeaveBalance_${leave.id}`) as OrgLeaveBalance;
      // leave.leaveBalances = l.leaveBalances;
      // this.store.removeItem(`leeaveBalance_${leave.id}`);
    }
  }



}
