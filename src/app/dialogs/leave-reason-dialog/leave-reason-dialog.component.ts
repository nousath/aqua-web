import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { ToastyService } from 'ng2-toasty';
import { NgForm } from '@angular/forms';
import { Leave } from '../../models/leave';

@Component({
  selector: 'aqua-leave-reason-dialog',
  templateUrl: './leave-reason-dialog.component.html',
  styleUrls: ['./leave-reason-dialog.component.css']
})
export class LeaveReasonDialogComponent implements OnInit {

  @ViewChild('LeaveReason') LeaveReason: NgForm;
  leave: Leave = new Leave();

  type: string;

  constructor(public dialogRef: MdDialogRef<LeaveReasonDialogComponent>,
    private toastyService: ToastyService,
    @Inject(MD_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
  }
  continue() {
    this.dialogRef.close(this.data);
  }

}
