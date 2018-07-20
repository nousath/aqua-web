import { Component, OnInit, Input } from '@angular/core';
import { Employee } from '../../../models/employee';
import { AmsEmployeeService } from '../../../services/index';

@Component({
  selector: 'aqua-emp-shift',
  templateUrl: './emp-shift.component.html',
  styleUrls: ['./emp-shift.component.css']
})
export class EmpShiftComponent implements OnInit {

  @Input() code: string;
  employee: Employee = new Employee();
  constructor(
    private amsEmployeeService: AmsEmployeeService,
  ) { }

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
        // this.getLeaveBalance(this.employee.id)

      });
  }

}
