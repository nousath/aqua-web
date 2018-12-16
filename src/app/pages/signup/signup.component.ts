import { Component, OnInit, Renderer2 } from '@angular/core';
import { Model } from '../../common/contracts/model';
import { User, EmsEmployee } from '../../models';
import { Subscription } from 'rxjs/Subscription';
import { AmsEmployeeService, EmsOrganizationService, EmsAuthService, ValidatorService } from '../../services';
import { Angulartics2GoogleAnalytics } from 'angulartics2';
import { LocalStorageService } from '../../services/local-storage.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastyService } from 'ng2-toasty';



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
    return `${this.char_1}${this.char_2}${this.char_3}${this.char_4}${this.char_5}${this.char_6}`
  }
}


@Component({
  selector: 'ams-gs-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  user: Model<User>;
  otpModel: EmsEmployee;
  signupEmail = '';
  isProcessing = false;
  section: 'SIGNIN' | 'SIGNUP' | 'OTP' | 'COMPLETE' | 'FORGOTPASSWORD' | 'RESETPASSWORD' = 'SIGNUP';
  verifyOTP: VerifyOTP = new VerifyOTP();
  // organizations: Page<Organization>;
  // newOrg: boolean = false;
  profileModel: EmsEmployee = new EmsEmployee();
  subscription: Subscription;

  constructor(
    private amsEmployeeService: AmsEmployeeService,
    private renderer: Renderer2,
    public angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics,
    private emsOrganizationService: EmsOrganizationService,
    private emsAuthService: EmsAuthService,
    public validatorService: ValidatorService,
    private store: LocalStorageService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastyService: ToastyService) {
    this.user = new Model({
      api: emsAuthService.signin,
      properties: new User()
    });

    this.subscription = this.activatedRoute.params.subscribe(
      params => {
        this.signupEmail = params['email'];
        this.signUp();
      }
    );

  }

  checkOnBoardingStatus(status: string, user_access_token: string, org_code: string) {
    switch (status) {
      case 'employees':
        this.router.navigate(['/pages/wizard/devices']);
        break;
      case 'devices':
        this.router.navigate(['/pages/wizard/syncapp']);
        break;
      case 'syncapp':
        this.router.navigate(['/pages/wizard/alerts']);
        break;
      case 'alerts':
        this.router.navigate(['/pages/wizard/complete']);
        break;
      case 'complete':
        this.emsAuthService.goHome()
        break;
      default:
        this.router.navigate(['/pages']);
        break;
    }
  };

  login() {
    // if (!this.user.properties.email || !this.user.properties.password) {
    //   return this.user.properties.email ? this.user.properties.password ? null : this.toastyService.info({ title: 'Info', msg: 'Please enter Password' }) : this.toastyService.info({ title: 'Info', msg: 'Please enter Username' });
    // }
    // this.isProcessing = true;
    // this.emsAuthService.login(this.user.properties).subscribe(() => {
    //   const emsUser = this.emsAuthService.currentUser();
    //   if (emsUser.status.toLowerCase() === 'verified') {
    //     this.section = 'COMPLETE';
    //     return this.isProcessing = false;
    //   }
    // }, err => { this.isProcessing = false; this.toastyService.error({ title: 'Error', msg: err }) });
    // this.user.create().then((emsUser: User) => {
    //   if (emsUser.status.toLowerCase() === 'verified') {
    //     this.section = 'COMPLETE';
    //     return this.isProcessing = false;
    //   }
    // }
    // ).catch(err => { this.isProcessing = false; this.toastyService.error({ title: 'Error', msg: err }) });
  }

  signUp() {
    if (!this.signupEmail) {
      return this.toastyService.info({ title: 'Info', msg: 'Please enter Email' });
    }

    if (!this.validatorService.validateEmail(this.signupEmail)) {
      return this.toastyService.info({ title: 'Info', msg: 'Please enter a Valid Email' })
    }

    this.isProcessing = true;
    const model: any = {
      email: this.signupEmail
    }
    this.emsAuthService.signup.create(model).then(data => {
      this.isProcessing = false;
      if (data.status.toLowerCase() === 'verified') {
        this.section = 'COMPLETE';
        this.profileModel.id = data.id;
      }
      if (data.status.toLowerCase() === 'pending') {
        this.section = 'OTP';
        this.otpModel = data;
      }
      if (data.status.toLowerCase() === 'activate') {
        this.section = 'SIGNIN';
        this.user.properties.email = data.email;
      }
    }
    ).catch(err => {
      this.isProcessing = false;
      this.toastyService.error({ title: 'Error', msg: err });
    });

  }

  validateOtp() {
    const otp: any = {
      activationCode: this.verifyOTP.concatChar()
    }
    this.isProcessing = true;
    this.emsAuthService.verify.create(otp, `${this.otpModel.id}`).then(
      data => {
        this.section = 'COMPLETE';
        this.isProcessing = false;
        this.profileModel.id = data.id;
      }
    ).catch(err => { this.isProcessing = false; this.toastyService.error({ title: 'Error', msg: err }) });
  }

  // onSelectOrg() {
  //   this.newOrg = this.profileModel.organization.id == 'new' ? true : false;
  // }

  setupProfile(password2: string) {
    // if (password2 !== this.profileModel.password) {
    //   return this.toastyService.error({ title: 'Error', msg: 'Password and Confirm Password should be same' })
    // }
    // this.isProcessing = true;
    // this.profileModel.organization.id = this.profileModel.organization.id === 'new' ? null : this.profileModel.organization.id;
    // this.emsAuthService.completeSignup(this.profileModel).subscribe(data => {
    //   this.isProcessing = false;
    // }, err => { this.isProcessing = false; this.toastyService.error({ title: 'Error', msg: err }) });
  };

  resetPassword(password2: string) {
    // if (password2 !== this.profileModel.password) {
    //   return this.toastyService.error({ title: 'Error', msg: 'Password and Confirm Password should be same' })
    // }
    // this.isProcessing = true;
    // this.emsAuthService.setPassword(this.profileModel.id, this.verifyOTP.concatChar(), this.profileModel.password).subscribe(
    //   this.loginHandler, this.errorHandler)

  };

  forgotpass() {
    this.section = 'RESETPASSWORD'
    this.resendOTP();
  }

  resendOTP() {
    const resend: any = {
      email: this.signupEmail
    }
    this.isProcessing = true;
    this.emsAuthService.forgotPassword.create(resend).then(
      data => {
        this.isProcessing = false;
        // this.section = 'COMPLETE';
        this.profileModel.id = data.id;


      }
    ).catch(err => { this.isProcessing = false; this.toastyService.error({ title: 'Error', msg: err }) });
  }

  switch(section: 'SIGNIN' | 'SIGNUP' | 'OTP' | 'COMPLETE' | 'FORGOTPASSWORD' | 'RESETPASSWORD' = 'SIGNIN') {
    this.section = section;
  }

  focusToNext(e: HTMLInputElement, nextEle?: HTMLInputElement) {
    if (e.value && nextEle && e.maxLength === e.value.length) {
      nextEle.select();
      nextEle.focus();
    }
  }

  ngOnInit() {
  }


  private errorHandler = err => { this.isProcessing = false; this.toastyService.error({ title: 'Error', msg: err }); }

  private loginHandler = employee => { this.isProcessing = false; this.emsAuthService.goHome(); }

}
