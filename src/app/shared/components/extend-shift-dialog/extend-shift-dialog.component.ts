import { Component, OnInit, Input, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import * as moment from 'moment';
import { AnimationStyleMetadata } from '../../../../../node_modules/@angular/animations';
import { Data } from '@agm/core/services/google-maps-types';
import { ToastyService } from 'ng2-toasty';


@Component({
  selector: 'aqua-extend-shift-dialog',
  templateUrl: './extend-shift-dialog.component.html',
  styleUrls: ['./extend-shift-dialog.component.css']
})
export class ExtendShiftDialogComponent implements OnInit {
  @Input()
  title = 'Date'

  @Input()
  continueText = 'Continue'

  @Input()
  cancelText = 'Cancel'

  @Input()
  dateToday: string;
  dateTomorrow: string;
  selectedDate: string;
  time: string;
  current: Date;
  todayShift: string;
  todayStartTime: string;
  todayEndTime: string;
  tomorrowShift: string;
  tomorrowStartTime: string;
  tomorrowEndTime: string;

  constructor(public dialogRef: MdDialogRef<ExtendShiftDialogComponent>,
    private toastyService: ToastyService,
    @Inject(MD_DIALOG_DATA) public data: { currentShifts: any, nextShift: any, date: string }
  ) {
    this.extendCurrentShift()
  }

  ngOnInit() {
  }

  // updated($event) {
  //   this.date = $event.currentTarget.value
  // }
  ngOnChanges() {
  }

  extendCurrentShift() {
    this.dateToday = this.data.date;
    this.todayShift = this.data.currentShifts.shiftType.name;
    this.todayStartTime = this.data.currentShifts.shiftType.startTime;
    this.todayEndTime = this.data.currentShifts.shiftType.endTime;
    this.selectedDate = this.dateToday;

    this.dateTomorrow = moment(this.dateToday).add(1, 'days').toISOString();
    if (this.data.nextShift.length) {
      this.data.nextShift.forEach(shift => {
        if (shift.date <= this.dateToday) {
          this.todayShift = shift.shiftType.name;
          this.todayStartTime = shift.shiftType.startTime;
          this.todayEndTime = shift.shiftType.endTime;
        }
        if (shift.date <= this.dateTomorrow) {
          this.tomorrowShift = shift.shiftType.name;
          this.tomorrowStartTime = shift.shiftType.startTime;
          this.tomorrowEndTime = shift.shiftType.endTime;
        }
      })
    } else {
      this.tomorrowShift = this.todayShift;
      this.tomorrowStartTime = this.todayStartTime;
      this.tomorrowEndTime = this.todayEndTime;
    }
    if (this.data.nextShift.length) {
      this.data.nextShift.forEach(element => {

      });
    }
    else
      this.tomorrowShift = this.data.currentShifts.shiftType.startTime
  }

  continue() {
    const today = moment(this.selectedDate).toDate()
    const checkTimes: string[] = this.time.split(':');
    this.current = moment(today).hours(parseInt(checkTimes[0])).minutes(parseInt(checkTimes[1])).toDate()

    if ((this.selectedDate === this.dateToday) && (moment(this.current).get('hour') <= moment(this.todayEndTime).get('hour') - 1)) {
      this.toastyService.info({ title: 'Info', msg: 'Time should be greater than ' })
    }
    if ((this.selectedDate === this.dateTomorrow) && (moment(this.current).get('hour') >= moment(this.tomorrowStartTime).get('hour'))) {
      this.toastyService.info({ title: 'Info', msg: 'Time should be less than ' })
    } else {
      this.dialogRef.close(this.current);
    }
  }

  setDate(date) {
    this.selectedDate = date;
  }
}
