import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';

@Component({
  selector: 'aqua-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent implements OnInit {

  msg: string = '';
  constructor(public dialogRef: MdDialogRef<ConfirmDialogComponent>) { }

  ngOnInit() {
  }

}
