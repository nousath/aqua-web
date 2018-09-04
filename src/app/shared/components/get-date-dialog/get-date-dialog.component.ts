import { Component, OnInit, Input, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import * as moment from 'moment';
import { AnimationStyleMetadata } from '../../../../../node_modules/@angular/animations';
import { Data } from '@agm/core/services/google-maps-types';

@Component({
  selector: 'aqua-get-date-dialog',
  templateUrl: './get-date-dialog.component.html',
  styleUrls: ['./get-date-dialog.component.css']
})
export class GetDateDialogComponent implements OnInit {

  @Input()
  title = 'Date'

  @Input()
  continueText = 'Continue'

  @Input()
  cancelText = 'Cancel'

  @Input()
  date: string;

  time: string;
  current: Date;
  todayShift: string;
  tomorrowShift: string;

  constructor(public dialogRef: MdDialogRef<GetDateDialogComponent>,
    @Inject(MD_DIALOG_DATA) public data: { currentShifts: any, nextShift: any, date: string }
  ) {}

  ngOnChanges() {
    console.log(this.data.currentShifts)
  }


  ngOnInit() {
  }

  updated($event) {
    this.date = $event.currentTarget.value
  }

  timeUpdated(time: string) {
    const today = new Date();
    const checkTimes: string[] = time.split(':');
    this.current = moment(today).hours(parseInt(checkTimes[0])).minutes(parseInt(checkTimes[1])).toDate()
    this.date = this.current.toISOString()
  }

  continue() {
    const date = moment(this.date).toDate()
    this.dialogRef.close(date);
  }

}
