import { Component, OnInit } from '@angular/core';
import { ToastyService, ToastyConfig } from 'ng2-toasty';

@Component({
  selector: 'aqua-attendances',
  templateUrl: './attendances.component.html',
  styleUrls: ['./attendances.component.css']
})
export class AttendancesComponent implements OnInit {

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
