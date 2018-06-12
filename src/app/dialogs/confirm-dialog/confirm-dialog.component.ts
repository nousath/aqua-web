import { Component, OnInit, ViewChild } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { NgForm } from '@angular/forms';
import { ToastyService } from 'ng2-toasty';
import { EmsEmployee } from '../../models/index';


@Component({
  selector: 'aqua-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent implements OnInit {

  employee: EmsEmployee = new EmsEmployee();


  @ViewChild('TerminateForm') TerminateForm: NgForm;

  msg: string = '';
  constructor(public dialogRef: MdDialogRef<ConfirmDialogComponent>,
    private toastyService: ToastyService, ) {
  }

  ngOnInit() {
  }

  continue() {

    this.dialogRef.close(this.employee);
  }
}
