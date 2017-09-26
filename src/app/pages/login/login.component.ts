import { Component, OnInit, OnDestroy } from '@angular/core';
import { Model } from '../../common/contracts/model';
import { User } from '../../models';
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
  char_1: string = '';
  char_2: string = '';
  char_3: string = '';
  char_4: string = '';
  char_5: string = '';
  char_6: string = '';
  maxLength: number = 1;
  minLength: number = 1;
  concatChar(): string {
    return `${this.char_1}${this.char_2}${this.char_3}${this.char_4}${this.char_5}${this.char_6}`
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
  signupEmail: string = '';
  isLoggingIn: boolean = false;
  section: 'SIGNIN' | 'SIGNUP' | 'OTP' | 'COMPLETE' | 'FORGOTPASSWORD' | 'RESETPASSWORD' = 'SIGNIN';
  verifyOTP: VerifyOTP = new VerifyOTP();
  organizations: Page<Organization>;
  newOrg: boolean = false;
  profileModel: EmsEmployee = new EmsEmployee();
  subscription: Subscription;


  constructor(private activatedRoute: ActivatedRoute,
    private emsEmployeeService: EmsEmployeeService,
    private amsEmployeeService: AmsEmployeeService,
    private emsOrganizationService: EmsOrganizationService,
    private emsAuthService: EmsAuthService,
    public validatorService: ValidatorService,
    private store: LocalStorageService,
    private router: Router,
    private toastyService: ToastyService) {

    this.subscription = activatedRoute.queryParams.subscribe(queryParams => {
      let token: string = queryParams['user_access_token'];
      let orgCode: string = queryParams['org_code'];
      if (token && orgCode) {
        orgCode = orgCode.toLowerCase();
        this.store.setItem('external-token', token);
        this.store.setItem('orgCode', orgCode);
        return this.loginToAms();
      }
    })


    this.user = new Model({
      api: emsAuthService.signin,
      properties: new User()
    });

    this.organizations = new Page({
      api: emsOrganizationService.organizations,
    });
    this.organizations.fetch().catch(err => toastyService.error({ title: 'Error', msg: err }));

  }

  login() {
    if (!this.user.properties.email || !this.user.properties.password) {
      return this.user.properties.email ? this.user.properties.password ? null : this.toastyService.info({ title: 'Info', msg: 'Please enter Password' }) : this.toastyService.info({ title: 'Info', msg: 'Please enter Username' });
    }
    this.isLoggingIn = true;
    this.user.create().then(
      (emsUser: User) => {
        if (emsUser.status.toLowerCase() == 'verified') {
          this.section = 'COMPLETE';
          return this.isLoggingIn = false;
        }
        this.store.setItem('external-token', emsUser.token); // for ems its aceess-token
        this.store.setItem('orgCode', emsUser.organization.code);
        this.loginToAms();
      }
    ).catch(err => { this.isLoggingIn = false; this.toastyService.error({ title: 'Error', msg: err }) });
  }


  loginToAms() {
    let tempData: any = { "device": { "id": "string" } };
    this.isLoggingIn = true;
    this.amsEmployeeService.employees.create(tempData).then(
      (amsUser) => {
        this.isLoggingIn = false;
        if (amsUser.userType == 'normal') {
          this.router.navigate(['/download']);
          return this.toastyService.info({ title: 'Info', msg: 'You are not authorized to use this application. Please contact the system administrator if you need to access this application' })
        }
        this.store.setItem('ams_token', amsUser.token);
        this.store.setObject('user', amsUser);
        this.store.setItem('orgCode', amsUser.organization.code.toLowerCase());
        if (amsUser.userType == 'superadmin')
          this.router.navigate(['/pages']);
        if (amsUser.userType == 'admin')
          this.router.navigate(['/pages/subAdmin']);
      }
    ).catch(err => { this.isLoggingIn = false; this.toastyService.error({ title: 'Error', msg: err }) });
  }

  signUp() {
    if (!this.signupEmail) {
      return this.toastyService.info({ title: 'Info', msg: 'Please enter Email' })
    }

    // window.location.href = `${this.registerUrl}/#/signup/${this.signupEmail}`;
    var win = window.open(`${this.registerUrl}/#/signup/${this.signupEmail}`, '_blank');
    if (win) {
      //Browser has allowed it to be opened
      win.focus();
    } else {
      //Browser has blocked it
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
    let otp: any = {
      activationCode: this.verifyOTP.concatChar()
    }
    this.isLoggingIn = true;
    this.emsAuthService.verify.create(otp, `${this.otpModel.id}`).then(
      data => {
        this.section = 'COMPLETE';
        this.isLoggingIn = false;
        this.profileModel.id = data.id;
      }
    ).catch(err => { this.isLoggingIn = false; this.toastyService.error({ title: 'Error', msg: err }) });
  }

  onSelectOrg() {
    this.newOrg = this.profileModel.organization.id == 'new' ? true : false;
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
      return this.toastyService.error({ title: 'Error', msg: 'Password and Confirm Password should be same' })
    }
    this.isLoggingIn = true;
    this.profileModel.organization.id = this.profileModel.organization.id == 'new' ? null : this.profileModel.organization.id;
    this.emsAuthService.completeSignup.create(this.profileModel, this.profileModel.id).then(
      data => {
        this.store.setItem('external-token', data.token); // for ems its aceess-token
        this.store.setItem('orgCode', data.organization.code);
        this.isLoggingIn = false;
        this.loginToAms();
      }
    ).catch(err => { this.isLoggingIn = false; this.toastyService.error({ title: 'Error', msg: err }) });
  };

  resetPassword(password2: string) {
    if (password2 !== this.profileModel.password) {
      return this.toastyService.error({ title: 'Error', msg: 'Password and Confirm Password should be same' })
    }
    let resetPassModel = {
      activationCode: this.verifyOTP.concatChar(),
      password: this.profileModel.password
    }
    this.isLoggingIn = true;
    this.emsAuthService.resetPassword.create(resetPassModel, `${this.profileModel.id}`).then(
      data => {
        this.store.setItem('external-token', data.token); // for ems its aceess-token
        this.store.setItem('orgCode', data.organization.code);
        this.isLoggingIn = false;
        this.loginToAms();
      }
    ).catch(err => { this.isLoggingIn = false; this.toastyService.error({ title: 'Error', msg: err }) });

  };

  forgotpass() {
    this.section = 'RESETPASSWORD';
    this.resendOTP();
  }

  resendOTP() {
    let resend: any = {
      email: this.signupEmail
    }
    this.isLoggingIn = true;
    this.emsAuthService.forgotPassword.create(resend).then(
      data => {
        this.isLoggingIn = false;
        // this.section = 'COMPLETE';
        this.profileModel.id = data.id;


      }
    ).catch(err => { this.isLoggingIn = false; this.toastyService.error({ title: 'Error', msg: err }) });
  }

  switch(section: 'SIGNIN' | 'SIGNUP' | 'OTP' | 'COMPLETE' | 'FORGOTPASSWORD' | 'RESETPASSWORD' = 'SIGNIN') {
    this.section = section;
  }

  ngOnInit() {
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
