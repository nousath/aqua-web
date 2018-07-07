import { Component, OnInit, Input } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { Employee, DayEvent, Attendance, TimeLogs } from '../../../models';
import { AmsAttendanceService, AmsTimelogsService } from '../../../services';
import * as moment from 'moment';
import { ToastyService } from 'ng2-toasty';

@Component({
  selector: 'aqua-bulk-time-logs-dialog',
  templateUrl: './bulk-time-logs-dialog.component.html',
  styleUrls: ['./bulk-time-logs-dialog.component.css']
})
export class BulkTimeLogsDialogComponent implements OnInit {

  logs: {
    position: number,
    code: string,
    date: string,
    time: string,
    type: string,
    isInValid?: boolean
  }[] = [];
  isLoading = false;



  constructor(
    private amsTimelogsService: AmsTimelogsService,
    public dialogRef: MdDialogRef<BulkTimeLogsDialogComponent>,
    private toastyService: ToastyService
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.add()
  }

  validate(item: any) {
    if (item.code && item.time && item.date && item.date) {
      item.isInValid = false;
    }

    if (!item.code) {
      item.isInValid = false;
    }
  }

  remove(item: any) {
    const index = this.logs.findIndex(log => {
      return log.position === item.position
    })

    this.logs.splice(index, 1);
  }

  add() {
    this.logs.push({
      position: this.logs.length,
      code: '',
      date: '',
      time: '',
      type: 'checkIn'
    })
    this.logs.push({
      position: this.logs.length,
      code: '',
      date: '',
      time: '',
      type: 'checkOut'
    })
  }

  save() {
    this.isLoading = true;
    const timeLogs: TimeLogs[] = [];
    let isValid = true;
    this.logs.forEach(log => {
      log.isInValid = false;
      if (!log.code) {
        return;
      }
      if (!log.date || !log.time || !log.type) {
        log.isInValid = true;
        isValid = false;
        return;
      }
      const timeLog = new TimeLogs();
      const checkTimes: string[] = log.time.split(':');
      timeLog.time = moment(log.date).hours(parseInt(checkTimes[0])).minutes(parseInt(checkTimes[1])).toDate()
      timeLog.employee = new Employee()
      timeLog.employee.code = log.code;
      timeLog.type = log.type;
      timeLog.source = 'byAdmin';
      timeLogs.push(timeLog)
    });

    if (!isValid) {
      this.toastyService.error({ title: 'Error', msg: 'Some rows are invalid. Please check' });
      return;
    }

    if (!timeLogs.length) {
      this.toastyService.error({ title: 'Error', msg: 'No data to save' });
      return;
    }

    this.amsTimelogsService.timeLogs.bulkCreate(timeLogs).then(() => {
      this.isLoading = false;
      this.dialogRef.close(true);
    }).catch(err => {
      this.isLoading = false;
      this.toastyService.error({ title: 'Error', msg: err });
    });
  }

  onCancel() {
    this.dialogRef.close(false);
  }

}
