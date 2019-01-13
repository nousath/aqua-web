import { Component, OnInit, ViewChild } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { Attendance } from '../../models/daily-attendance';
import { DayEvent } from '../../models/day-event';
import { NgForm } from '@angular/forms';
import { ToastyService } from 'ng2-toasty';

@Component({
  selector: 'aqua-day-event-dialog',
  templateUrl: './day-event-dialog.component.html',
  styleUrls: ['./day-event-dialog.component.css']
})
export class DayEventDialogComponent implements OnInit {

  attendance: DayEvent = new DayEvent();

  checkIn: string;
  checkOut: string;
  isHoliday = false;
  holiday = '';



  constructor(public dialogRef: MdDialogRef<DayEventDialogComponent>,
    private toastyService: ToastyService, ) { }

  ngOnInit() {
  }

  save() {
    if (!this.checkIn || !this.checkOut) {
      return this.checkIn ? this.toastyService.info({ title: 'Info', msg: 'Please Enter Check Out ' }) :
        this.toastyService.info({ title: 'Info', msg: 'Please Enter Check In ' });
    } else {
      // this.attendance.ofDate = new Date(this.attendance.ofDate).toISOString();
      // const checkIns: string[] = this.checkIn.split(':');
      // const checkOuts: string[] = this.checkOut.split(':');
      // this.attendance.checkIn = new Date(new Date(this.attendance.ofDate).setHours(parseInt(checkIns[0]), parseInt(checkIns[1]))).toISOString();
      // this.attendance.checkOut = new Date(new Date(this.attendance.ofDate).setHours(parseInt(checkOuts[0]), parseInt(checkOuts[1]))).toISOString();
      this.dialogRef.close(this.attendance);
    }

  }

}
