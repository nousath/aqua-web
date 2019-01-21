import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Employee } from '../../../models/employee';
import { AmsEmployeeService, AmsLeaveService } from '../../../services/index';
import { LeaveBalance } from '../../../models/index';
import { PagerModel } from '../../../common/ng-structures';
import { PageOptions } from '../../../common/ng-api/index';
import { ToastyService } from 'ng2-toasty';
import { EmsAuthService } from '../../../services/ems/ems-auth.service';
import { MdDialog } from '@angular/material';
import { GetValueDialogComponent } from '../../../shared/components/get-value-dialog/get-value-dialog.component';

@Component({
  selector: 'aqua-emp-leaves',
  templateUrl: './emp-leaves.component.html',
  styleUrls: ['./emp-leaves.component.css']
})
export class EmpLeavesComponent implements OnInit, OnChanges {
  @Input()
  employee: Employee;

  leaveBalances: LeaveBalance[];
  isProcessing = false;

  constructor(
    private amsEmployeeService: AmsEmployeeService,
    private amsLeaveService: AmsLeaveService,
    public auth: EmsAuthService,
    private toastyService: ToastyService,
    public dialog: MdDialog
  ) {
  }

  ngOnInit() {
  }
  ngOnChanges() {
    if (this.employee) {
      this.isProcessing = true;
      const input = new PageOptions();
      input.noPaging = true;
      input.query = {
        employeeId: this.employee.id
      };
      this.amsLeaveService.leaveBalances.search(input).then(page => {
        this.isProcessing = false;
        this.leaveBalances = page.items;
      })
    }
  }

  add(item: LeaveBalance) {

    const dialogRef = this.dialog.open(GetValueDialogComponent)
    const component = dialogRef.componentInstance;
    component.title = `Add ${item.leaveType.name}`
    component.showComment = true;
    component.type = 'number';
    component.value = 0;
    component.valueLabel = 'No of Days'

    dialogRef.afterClosed().subscribe((response: any) => {
      if (response === false) { return; }
      item.isProcessing = true;
      this.amsLeaveService.leaveBalances.simplePost({
        days: parseInt(response.value),
        journal: {
          comment: response.comment
        }
      }, `${item.id}/grant`).then(data => {
        item.days = data.days
        item.isProcessing = false;
      }).catch(err => {
        item.isProcessing = false;
        this.toastyService.error({ title: 'Error', msg: err });
      });
    });
  }
}
