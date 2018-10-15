import { Component, OnInit, Input, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import * as moment from 'moment';
import { AnimationStyleMetadata } from '../../../../../node_modules/@angular/animations';
import { Data } from '@agm/core/services/google-maps-types';
import { ToastyService } from 'ng2-toasty';
import { Shift } from '../../../models/shift';


@Component({
  selector: 'aqua-extend-shift-dialog',
  templateUrl: './extend-shift-dialog.component.html',
  styleUrls: ['./extend-shift-dialog.component.css']
})
export class ExtendShiftDialogComponent implements OnInit {
  date: Date;
  time: string;
  currentShift: Shift;
  nextShift: Shift;

  constructor(public dialogRef: MdDialogRef<ExtendShiftDialogComponent>,
    private toastyService: ToastyService,
    @Inject(MD_DIALOG_DATA) public data: {
      currentShift: Shift,
      nextShift: Shift,
      date: Date,
      time: string
    }
  ) {
    this.currentShift = this.data.currentShift;
    this.nextShift = this.data.nextShift;
    this.date = this.data.date;
    this.time = this.data.time;
  }

  ngOnInit() {
  }


  // extendCurrentShift() {
  //   this.dateToday = this.data.date;
  //   this.currentShift = this.data.currentShifts.shiftType.name;
  //   // this.todayStartTime = this.data.currentShifts.shiftType.startTime;
  //   // this.todayEndTime = this.data.currentShifts.shiftType.endTime;
  //   this.selectedDate = this.dateToday;

  //   this.dateTomorrow = moment(this.dateToday).add(1, 'days').toISOString();
  //   if (this.data.nextShift.length) {
  //     this.data.nextShift.forEach(shift => {
  //       if (shift.date <= this.dateToday) {
  //         this.currentShift = shift;
  //         // this.todayStartTime = shift.shiftType.startTime;
  //         // this.todayEndTime = shift.shiftType.endTime;
  //       } else if (shift.date <= this.dateTomorrow) {
  //         this.nextShift = shift;
  //         // this.tomorrowStartTime = shift.shiftType.startTime;
  //         // this.tomorrowEndTime = shift.shiftType.endTime;
  //       }
  //     })
  //   } else {
  //     this.nextShift = this.currentShift;
  //     this.tomorrowStartTime = this.todayStartTime;
  //     this.tomorrowEndTime = this.todayEndTime;
  //   }
  //   if (this.data.nextShift.length) {
  //     this.data.nextShift.forEach(element => {

  //     });
  //   }
  //   else
  //     this.nextShift = this.data.currentShifts.shiftType.startTime
  // }

  timeChanged() {
    console.log(this.time);
  }
  setTime(time) {
    this.time = moment(time).format('HH:mm')
  }

  continue() {

    const checkTimes: string[] = this.time.split(':');
    const value = moment(this.date).hours(parseInt(checkTimes[0])).minutes(parseInt(checkTimes[1])).toDate()
    this.dialogRef.close(value);

    // if ((this.selectedDate === this.dateToday) && (moment(this.current).get('hour') <= moment(this.todayEndTime).get('hour') - 1)) {
    //   this.toastyService.info({ title: 'Info', msg: 'Time should be greater than ' })
    // }
    // if ((this.selectedDate === this.dateTomorrow) && (moment(this.current).get('hour') >= moment(this.tomorrowStartTime).get('hour'))) {
    //   this.toastyService.info({ title: 'Info', msg: 'Time should be less than ' })
    // } else {
    // }
  }

  // setDate(date) {
  //   this.selectedDate = date;
  // }
}
