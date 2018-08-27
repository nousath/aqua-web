import { Component, OnInit, Input } from '@angular/core';
import { MdDialogRef } from '@angular/material';
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

  constructor(public dialogRef: MdDialogRef<GetDateDialogComponent>) {

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

  extendShift() {
    console.log(this.date)
    this.timeUpdated(this.date.toString());
    const date = moment(this.date).toDate().toISOString();
    console.log(date)
    this.dialogRef.close(date);
  }
}
