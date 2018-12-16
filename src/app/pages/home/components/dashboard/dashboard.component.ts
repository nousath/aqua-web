import { Component, OnInit } from '@angular/core';
import { Employee } from '../../../../models';
import { EmsAuthService } from '../../../../services';
import { AmsEmployeeService } from '../../../../services/ams/ams-employee.service';


@Component({
  selector: 'aqua-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  employee: Employee;
  isProcessing = false;

  constructor(private auth: EmsAuthService,
    private employeeService: AmsEmployeeService
  ) { }

  ngOnInit() {
    this.isProcessing = true;

    this.employeeService.employees.get('my').then(employee => {
      this.employee = employee
      this.isProcessing = false;

    })
  }

}
