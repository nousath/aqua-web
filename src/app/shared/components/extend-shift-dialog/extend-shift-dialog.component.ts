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

  isCustom = false;

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

    if (moment(this.date).isSame(this.currentShift.date, 'd')) {
      this.date = this.currentShift.date
    } else if (moment(this.date).isSame(this.nextShift.date, 'd')) {
      this.date = this.nextShift.date
    }
  }

  ngOnInit() {
  }



  reset() {
    this.setTime(this.currentShift.shiftType.endTime);
    this.date = this.currentShift.date;
  }

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

  }
}
