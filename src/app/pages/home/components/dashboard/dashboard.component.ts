import { Component, OnInit } from '@angular/core';
import { Employee } from '../../../../models';
import { EmsAuthService } from '../../../../services';

@Component({
  selector: 'aqua-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  employee: Employee;
  constructor(private auth: EmsAuthService) { }

  ngOnInit() {
    this.employee = this.auth.currentEmployee();
  }

}
