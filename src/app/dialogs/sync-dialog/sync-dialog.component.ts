import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { ToastyService } from 'ng2-toasty';
import { NgForm } from '@angular/forms';
import { ValidatorService } from '../../services/validator.service';

@Component({
  selector: 'aqua-sync-dialog',
  templateUrl: './sync-dialog.component.html',
  styleUrls: ['./sync-dialog.component.css']
})
export class SyncDialogComponent implements OnInit {

  @Input()
  fromDate: Date;

  @ViewChild('deviceForm') deviceForm: NgForm;


  constructor(public dialogRef: MdDialogRef<SyncDialogComponent>,
    public validatorService: ValidatorService) {
  }

  save() {
    this.dialogRef.close(this.fromDate);
  }

  ngOnInit() {
  }

}
