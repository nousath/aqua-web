import { Component, OnInit, Input } from '@angular/core';
import { Attendance } from '../../../models/index';

@Component({
  selector: 'aqua-daily-mobile-view',
  templateUrl: './daily-mobile-view.component.html',
  styleUrls: ['./daily-mobile-view.component.css']
})
export class DailyMobileViewComponent implements OnInit {
  @Input() attendance: Attendance[]

  currentAttendances: Attendance[]

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.attendance) {
      this.currentAttendances = this.attendance
      console.log(this.attendance)
      console.log(this.currentAttendances)
    }
  }

}
