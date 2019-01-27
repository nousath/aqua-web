import { Component, OnInit, Input } from '@angular/core';
import { LeaveBalance } from '../../../models';
import { MdDialogRef } from '@angular/material';

@Component({
  selector: 'aqua-journals',
  templateUrl: './journals.component.html',
  styleUrls: ['./journals.component.css']
})
export class JournalsComponent implements OnInit {
  @Input()
  balance: LeaveBalance;

  constructor(
    public dialogRef: MdDialogRef<JournalsComponent>,
  ) { }

  ngOnInit() {
  }

}
