import { Component, OnInit, Input } from '@angular/core';
import { MonthAttendance } from '../../../models/index';

@Component({
  selector: 'aqua-monthly-mobile-view',
  templateUrl: './monthly-mobile-view.component.html',
  styleUrls: ['./monthly-mobile-view.component.css']
})
export class MonthlyMobileViewComponent implements OnInit {
  @Input() monthlyAttendance: MonthAttendance

  constructor() { }


  ngOnChanges() {
    if (this.monthlyAttendance) {
      this.monthlyAttendance = this.monthlyAttendance
    }
  }
  ngOnInit() {

  }

}
