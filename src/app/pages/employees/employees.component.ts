import { Component, OnInit } from '@angular/core';
import { ToastyService, ToastyConfig } from 'ng2-toasty';

@Component({
  selector: 'aqua-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {

  constructor(private toastyService: ToastyService, private toastyConfig: ToastyConfig) {
    this.toastyConfig.theme = 'material';
    this.toastyConfig.timeout = 5000;
    this.toastyConfig.showClose = true;
    this.toastyConfig.limit = 2;
    this.toastyConfig.position = "top-right"
  }

  ngOnInit() {
  }

}
