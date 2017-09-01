import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { ToastyService } from 'ng2-toasty';
import { Leave } from '../../models/leave';

@Component({
  selector: 'aqua-leave-action-dialog',
  templateUrl: './leave-action-dialog.component.html',
  styleUrls: ['./leave-action-dialog.component.css']
})
export class LeaveActionDialogComponent implements OnInit {

  leave: Leave = new Leave();


  constructor(public dialogRef: MdDialogRef<LeaveActionDialogComponent>,
    private toastyService: ToastyService, ) { }

  ngOnInit() {
  }

  save() {
    if (!this.leave.rejectionReason) {
      return this.toastyService.info({ title: 'Info', msg: 'Please fill rejection eason ' });
    } else {
      this.dialogRef.close(this.leave.rejectionReason);
    }
  }

}
