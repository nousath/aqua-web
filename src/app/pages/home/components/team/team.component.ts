import { Component, OnInit } from '@angular/core';
import { Employee } from '../../../../models';
import { EmsAuthService } from '../../../../services/ems/ems-auth.service';
import { AmsEmployeeService } from '../../../../services';

@Component({
  selector: 'aqua-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {

  employee: Employee;
  isProcessing = false;
  constructor(
    private auth: EmsAuthService,
    private employeeService: AmsEmployeeService) { }

  ngOnInit() {
    this.isProcessing = true;
    this.employeeService.employees.get('my').then(employee => {
      this.employee = employee
      this.isProcessing = false;

    })
  }

}
