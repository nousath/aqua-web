import { Component, OnInit, ViewChild } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { NgForm } from '@angular/forms';
import { ToastyService } from 'ng2-toasty';
import { EmsEmployee } from '../../models';

@Component({
  selector: 'aqua-relieving-dialog',
  templateUrl: './relieving-dialog.component.html',
  styleUrls: ['./relieving-dialog.component.css']
})
export class RelievingDialogComponent implements OnInit {

  employee: EmsEmployee = new EmsEmployee();


  @ViewChild('TerminateForm') TerminateForm: NgForm;

  msg = '';
  constructor(public dialogRef: MdDialogRef<RelievingDialogComponent>,
    private toastyService: ToastyService, ) {
  }

  ngOnInit() {
  }

  continue() {

    this.dialogRef.close(this.employee);
  }
}
