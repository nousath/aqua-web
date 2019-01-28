import { Component, OnInit, Input } from '@angular/core';
import { Attendance } from '../../../models';
import * as moment from 'moment';

@Component({
  selector: 'aqua-attendance-status',
  templateUrl: './attendance-status.component.html',
  styleUrls: ['./attendance-status.component.css']
})
export class AttendanceStatusComponent implements OnInit {

  @Input()
  attendance: Attendance

  isPast = false;
  status = 'absent';
  info: string;
  secondHalfStatus = 'A'
  firstHalfStatus = 'A'

  shiftStatus = 'working';
  count = 0


  constructor() { }

  ngOnInit() {

    this.isPast = moment(this.attendance.ofDate).isBefore(new Date(), 'day');
    if (this.attendance) {
      this.status = this.attendance.status
      this.firstHalfStatus = this.attendance.firstHalfStatus
      this.secondHalfStatus = this.attendance.secondHalfStatus
      this.count = this.attendance.count
      if (this.attendance.shift) {
        this.shiftStatus = this.attendance.shift.status
      }
    }
  }

}
