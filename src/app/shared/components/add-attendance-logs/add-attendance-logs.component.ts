
import { Component, OnInit, Input } from '@angular/core';
import { ToastyService } from 'ng2-toasty';
import * as moment from 'moment';
import { TimeLogs, TimeLogsLocation } from '../../../models/time-logs';
import { AmsTimelogsService } from '../../../services';
import { Attendance } from '../../../models/daily-attendance';

@Component({
  selector: 'aqua-add-attendance-logs',
  templateUrl: './add-attendance-logs.component.html',
  styleUrls: ['./add-attendance-logs.component.css']
})
export class AddAttendanceLogsComponent implements OnInit {
  logs: TimeLogs[];

  @Input()
  attendance: Attendance;

  newTimeLog: TimeLogs;

  newTimeLogDate: string;
  newTimeLogTime: string;
  ofDate: Date;
  nextDate: Date;

  constructor(
    private toastyService: ToastyService,
    private amsTimelogsService: AmsTimelogsService) {

    this.ofDate = new Date();
  }

  ngOnInit() {
    this.ofDate = this.attendance.ofDate;
    this.newTimeLogDate = moment(this.ofDate).format('DD-MM-yyyy');
    this.nextDate = moment(this.ofDate).add(1, 'day').toDate();
    this.logs = this.attendance.timeLogs || [];
    this.seedNewLog()
  }

  onDateSelected() {
    if (this.newTimeLogDate && this.newTimeLogTime) {
      this.setDateTime();
    }
  }

  onTimeSelected() {
    if (this.newTimeLogDate && this.newTimeLogTime) {
      this.setDateTime();
    }
  }

  setDateTime() {
    const time = this.newTimeLogTime
    const checkTimes: string[] = time.split(':');
    this.newTimeLog.time  = moment(this.newTimeLogDate, 'DD-MM-yyyy').hours(parseInt(checkTimes[0])).minutes(parseInt(checkTimes[1])).toDate()
  }

  seedNewLog() {
    this.newTimeLog = new TimeLogs();
    this.newTimeLog.employee = this.attendance.employee;
    this.newTimeLog.source = 'byAdmin';
    this.newTimeLog.time = null;
    this.newTimeLog.type = 'checkIn';
    this.newTimeLogTime = null;
  }

  saveNewLog() {
    this.amsTimelogsService.timeLogs.create(this.newTimeLog).then(value => {
      this.logs.push(value);
      this.seedNewLog();
    }).catch(err => this.toastyService.error({ title: 'Error', msg: err }));
  }
}
