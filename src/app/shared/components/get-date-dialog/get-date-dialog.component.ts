import { Component, OnInit, Input } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import * as moment from 'moment';
import { AnimationStyleMetadata } from '../../../../../node_modules/@angular/animations';

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

  constructor(public dialogRef: MdDialogRef<GetDateDialogComponent>) {
  }

  ngOnInit() {
  }

  updated($event) {
    this.date = $event.currentTarget.value
  }

  continue() {
    const date = moment(this.date).toDate()
    this.dialogRef.close(date);
  }
}
