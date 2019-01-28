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
  status: string;
  info: string;


  constructor() { }

  ngOnInit() {

    this.isPast = moment(this.attendance.ofDate).isBefore(new Date(), 'day');

  }

}
