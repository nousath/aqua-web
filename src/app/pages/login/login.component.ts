import { Component, OnInit, OnDestroy } from '@angular/core';
import { Model } from '../../common/contracts/model';
import { User, Employee } from '../../models';
import { EmsEmployeeService } from '../../services/ems';
import { ToastyService } from 'ng2-toasty';
import { AmsEmployeeService } from '../../services/ams';
import { Router, ActivatedRoute } from '@angular/router';
import { ValidatorService, EmsOrganizationService, EmsAuthService } from '../../services';
import { EmsEmployee } from '../../models/ems/employee';
import { Organization } from '../../models/organization';
import { Page } from '../../common/contracts/page';
import { LocalStorageService } from '../../services/local-storage.service';
import { Subscription } from 'rxjs/Rx';
import { environment } from '../../../environments/environment';
declare var $: any;


class VerifyOTP {
  char_1 = '';
  char_2 = '';
  char_3 = '';
  char_4 = '';
  char_5 = '';
  char_6 = '';
  maxLength = 1;
  minLength = 1;
  concatChar(): string {
    return `${this.char_1}${this.char_2}${this.char_3}${this.char_4}${this.char_5}${this.char_6}`;
  }
}

enum FormSections { SIGNIN, SIGNUP, OTP, COMPLETE }

@Component({
  selector: 'aqua-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  webSiteUrl: string = environment.apiUrls.website;
  registerUrl: string = environment.apiUrls.register;

  user: Model<User>;
  otpModel: EmsEmployee;
  signupEmail = '';
  isLoggingIn = false;
  section: 'SIGNIN' | 'SIGNUP' | 'OTP' | 'COMPLETE' | 'FORGOTPASSWORD' | 'RESETPASSWORD' = 'SIGNIN';
  verifyOTP: VerifyOTP = new VerifyOTP();
  // organizations: Page<Organization>;
  newOrg = false;
  profileModel: EmsEmployee = new EmsEmployee();
  subscription: Subscription;


  constructor(
    activatedRoute: ActivatedRoute,
    // private emsOrganizationService: EmsOrganizationService,
    private emsAuthService: EmsAuthService,
    public validatorService: ValidatorService,
    private router: Router,
    private toastyService: ToastyService) {

    this.subscription = activatedRoute.queryParams.subscribe(queryParams => {
      const roleKey: string = queryParams['role-key'];
      const orgCode: string = queryParams['org-code'];
      if (roleKey) {
        this.isLoggingIn = true;
        this.emsAuthService.loginUsingKey(roleKey).subscribe(this.loginHandler, this.errorHandler)
      }
    });


    this.user = new Model({
      api: emsAuthService.signin,
      properties: new User()
    });

    // this.organizations = new Page({
    //   api: emsOrganizationService.organizations,
    // });
    // this.organizations.fetch().catch(err => toastyService.error({ title: 'Error', msg: err }));

  }

  login() {
    if (!this.user.properties.email) {
      return this.toastyService.info({ title: 'Info', msg: 'Please enter Email' });
    }

    if (!this.user.properties.password) {
      return this.toastyService.info({ title: 'Info', msg: 'Please enter Password' })
    }
    this.isLoggingIn = true;

    this.emsAuthService.login(this.user.properties)
      .subscribe(this.loginHandler, this.errorHandler)
  }



  signUp() {
    if (!this.signupEmail) {
      return this.toastyService.info({ title: 'Info', msg: 'Please enter Email' });
    }

    // window.location.href = `${this.registerUrl}/#/signup/${this.signupEmail}`;
    const win = window.open(`${this.registerUrl}/#/signup/${this.signupEmail}`, '_blank');
    if (win) {
      // Browser has allowed it to be opened
      win.focus();
    } else {
      // Browser has blocked it
      alert('Please allow popups for this website');
    }
    // this.isLoggingIn = true;
    // let model: any = {
    //   email: this.signupEmail
    // }
    // this.emsAuthService.signup.create(model).then(
    //   data => {
    //     this.isLoggingIn = false;
    //     if (data.status.toLowerCase() == 'verified') {
    //       this.section = 'COMPLETE';
    //       this.profileModel.id = data.id;
    //     } else {
    //       this.section = 'OTP';
    //       this.otpModel = data;
    //     }
    //   }
    // ).catch(err => { this.isLoggingIn = false; this.toastyService.error({ title: 'Error', msg: err }) });

  }

  validateOtp() {
    const otp: any = {
      activationCode: this.verifyOTP.concatChar()
    };
    this.isLoggingIn = true;
    this.emsAuthService.verify.create(otp, `${this.otpModel.id}`).then(
      data => {
        this.section = 'COMPLETE';
        this.isLoggingIn = false;
        this.profileModel.id = data.id;
      }
    ).catch(err => { this.isLoggingIn = false; this.toastyService.error({ title: 'Error', msg: err }); });
  }

  onSelectOrg() {
    this.newOrg = this.profileModel.organization.id === 'new' ? true : false;
  }

  // focusToNext(currentEle, nextEle) {
  //   let currentElement = document.getElementById('currentEle');
  //   // $(".optboxFocus").keyup(function () {
  //   //   if (this.value.length == this.maxLength) {
  //   //     $(this).next('.optboxFocus').focus();
  //   //   }
  //   // });
  //   console.log(currentEle, nextEle)
  // };

  setupProfile(password2: string) {
    if (password2 !== this.profileModel.password) {
      return this.toastyService.error({ title: 'Error', msg: 'Password and Confirm Password should be same' });
    }
    this.isLoggingIn = true;
    this.profileModel.organization.id = this.profileModel.organization.id === 'new' ? null : this.profileModel.organization.id;
    this.emsAuthService.completeSignup(this.profileModel)
      .subscribe(this.loginHandler, this.errorHandler)
  }

  resetPassword(password2: string) {
    if (password2 !== this.profileModel.password) {
      return this.toastyService.error({ title: 'Error', msg: 'Password and Confirm Password should be same' });
    }

    this.isLoggingIn = true;

    this.emsAuthService.resetPassword(this.profileModel.id, this.verifyOTP.concatChar(), this.profileModel.password)
      .subscribe(this.loginHandler, this.errorHandler)
  }

  forgotpass() {
    this.section = 'RESETPASSWORD';
    this.resendOTP();
  }

  resendOTP() {
    const resend: any = {
      email: this.signupEmail
    };
    this.isLoggingIn = true;
    this.emsAuthService.forgotPassword.create(resend).then(data => {
      this.isLoggingIn = false;
      this.profileModel.id = data.id;
    }
    ).catch(this.errorHandler);
  }

  switch(section: 'SIGNIN' | 'SIGNUP' | 'OTP' | 'COMPLETE' | 'FORGOTPASSWORD' | 'RESETPASSWORD' = 'SIGNIN') {
    this.section = section;
  }

  private errorHandler = err => { this.isLoggingIn = false; this.toastyService.error({ title: 'Error', msg: err }); }

  private loginHandler = employee => { this.isLoggingIn = false; this.emsAuthService.goHome(); }
  ngOnInit() {
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
