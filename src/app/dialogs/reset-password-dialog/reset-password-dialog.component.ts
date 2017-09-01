import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { ValidatorService } from '../../services/validator.service';
import { ToastyService } from 'ng2-toasty';
import { NgForm } from '@angular/forms';

export class ResetPassword {
  password: string = '';
  confirmPassword: string = '';
  isReset: boolean = false;
  toggle() {
    this.isReset = !this.isReset;
    this.password = '';
    this.confirmPassword = '';
  }
}

@Component({
  selector: 'aqua-reset-password-dialog',
  templateUrl: './reset-password-dialog.component.html',
  styleUrls: ['./reset-password-dialog.component.css']
})
export class ResetPasswordDialogComponent implements OnInit {

  resetPassword: ResetPassword = new ResetPassword();


  constructor(public dialogRef: MdDialogRef<ResetPasswordDialogComponent>,
    public validatorService: ValidatorService,
    private toastyService: ToastyService) { }

  ngOnInit() {
  }

  save(form: NgForm) {
    if (form.invalid)
      return this.toastyService.info({ title: 'Info', msg: 'Please fill all mandatory fields' })

    if (this.resetPassword.password !== this.resetPassword.confirmPassword) {
      return this.toastyService.info({ title: 'Info', msg: 'New Password and Confirm Password should be same' })
    }
    this.dialogRef.close(this.resetPassword.password);
  }

}
