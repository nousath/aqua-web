import { Component, OnInit, OnDestroy } from '@angular/core';
import { User, Employee } from '../../models';
import { EmsEmployeeService } from '../../services/ems';
import { ToastyService } from 'ng2-toasty';
import { AmsEmployeeService } from '../../services/ams';
import { Router, ActivatedRoute } from '@angular/router';
import { ValidatorService, EmsOrganizationService, EmsAuthService } from '../../services';
import { EmsEmployee } from '../../models/ems/employee';
import { Organization } from '../../models/organization';
import { LocalStorageService } from '../../services/local-storage.service';
import { Subscription } from 'rxjs/Rx';
import { environment } from '../../../environments/environment';
declare var $: any;

@Component({
  selector: 'aqua-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  otp = {
    char_1: '',
    char_2: '',
    char_3: '',
    char_4: '',
    char_5: '',
    char_6: ''
  };

  user: User = new User();
  isLoggingIn = false;
  section: 'SIGNIN' | 'SIGNUP-START' | 'SIGNUP-OTP' | 'SIGNUP-PASSWORD' | 'SIGNUP-EMPLOYMENT' | 'PASSWORD-FORGOT' | 'PASSWORD-OTP' | 'PASSWORD-RESET' = 'SIGNIN';
  organization: Organization = new Organization();
  newOrg = false;
  employee: EmsEmployee = new EmsEmployee();
  subscription: Subscription;

  orgSelector = true;
  createNewOrg = false;

  organizationTypes = [{
    text: 'Manufacturing',
    value: 'manufacturing'
  }, {
    text: 'Health Care',
    value: 'health-care'
  }, {
    text: 'Education',
    value: 'education'
  }, {
    text: 'BPO',
    value: 'bpo'
  }, {
    text: 'Services',
    value: 'services'
  }];

  constructor(
    activatedRoute: ActivatedRoute,
    private emsOrganizationService: EmsOrganizationService,
    private auth: EmsAuthService,
    public validatorService: ValidatorService,
    private store: LocalStorageService,
    private toastyService: ToastyService) {
    store.clear();
    this.subscription = activatedRoute.queryParams.subscribe(queryParams => {
      const roleKey: string = queryParams['role-key'];
      const orgCode: string = queryParams['org-code'];
      if (roleKey) {
        this.isLoggingIn = true;
        this.auth.loginUsingKey(roleKey).subscribe(this.loginHandler, this.errorHandler)
      }

      if (orgCode) {
        this.checkOrgCode(orgCode)
      }
    });

    const user = this.auth.currentUser();
    if (user) {
      this.user = user;
    }

    const role = this.auth.currentRole();

    if (user && (!role || !role.organization)) {
      this.section = 'SIGNUP-EMPLOYMENT'
    }
  }

  login() {
    this.store.clear();
    if (!this.user.email) {
      return this.toastyService.info({ title: 'Info', msg: 'Please enter Email' });
    }

    if (!this.user.password) {
      return this.toastyService.info({ title: 'Info', msg: 'Please enter Password' })
    }
    this.isLoggingIn = true;
    this.auth.login(this.user.email, this.user.password)
      .subscribe(this.loginHandler, this.errorHandler)
  }

  sendOTP(flow: string) {
    if (!this.user.email) {
      return this.toastyService.info({ title: 'Info', msg: 'Please enter Email' });
    }

    this.isLoggingIn = true;

    this.auth.sendOTP(this.user.email).subscribe(data => {
      this.isLoggingIn = false;
      switch (flow) {
        case 'SIGNUP-START':
        case 'SIGNUP-OTP':
          this.section = 'SIGNUP-OTP';
          break;

        case 'PASSWORD-FORGOT':
        case 'PASSWORD-RESET':
          this.section = 'PASSWORD-RESET';
          break;
      }

    }, this.errorHandler);
  }

  setPassword(flow: string, password2: string) {
    if (password2 !== this.user.password) {
      return this.toastyService.error({ title: 'Error', msg: 'Password and Confirm Password should be same' });
    }

    const otp = `${this.otp.char_1}${this.otp.char_2}${this.otp.char_3}${this.otp.char_4}${this.otp.char_5}${this.otp.char_6}`;

    this.isLoggingIn = true;
    this.auth.setPassword(this.user.email, otp, this.user.password).subscribe(data => {
      this.isLoggingIn = false;
      switch (flow) {
        case 'SIGNUP-OTP':
          this.section = 'SIGNUP-EMPLOYMENT';
          break;

        case 'PASSWORD-RESET':
          this.loginHandler();
          break;
      }
    }, this.errorHandler);
  }

  checkOrgCode(code: string) {
    this.emsOrganizationService.organizations.get(`${code}/summary`).then(org => {
      if (org) {
        this.organization = org;
      } else {
        this.organization = new Organization();
        this.organization.id = 'new';
        this.organization.code = code;
      }
    }).catch(err => {
      this.organization = new Organization()
    })
  }

  setupProfile() {
    this.isLoggingIn = true;
    this.organization.id = this.organization.id === 'new' ? undefined : this.organization.id;
    // this.employee.organization = this.organization;
    this.auth.join(this.employee, this.organization).subscribe((role) => {
      this.isLoggingIn = false;
      this.store.setItem('setup', 'employees')
      this.auth.goHome();
    }, this.errorHandler)
  }

  private errorHandler = (err) => {
    this.isLoggingIn = false;
    this.toastyService.error({ title: 'Error', msg: err });
  }

  private loginHandler = () => {
    this.isLoggingIn = false;
    this.auth.goHome();
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  focusToNext(e: HTMLInputElement, nextEle?: HTMLInputElement) {
    if (e.value && nextEle && e.maxLength === e.value.length) {
      nextEle.select();
      nextEle.focus();
    }
  }
}
