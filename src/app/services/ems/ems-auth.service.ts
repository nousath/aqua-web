import { Injectable } from '@angular/core';
import { IApi } from '../../common/contracts/api/api.interface';
import { Http } from '@angular/http';
import { GenericApi } from '../../common/generic-api';

@Injectable()
export class EmsAuthService {

  signup: IApi<any>;
  verify: IApi<any>;
  forgotPassword: IApi<any>;
  completeSignup: IApi<any>;
  resetPassword: IApi<any>;
  signin: IApi<any>;

  constructor(private http: Http) {
    const baseApi = 'ems';
    this.signin = new GenericApi<any>('users/signIn', http, baseApi);
    this.signup = new GenericApi<any>('authorizations/signUp', http, baseApi);
    this.verify = new GenericApi<any>('authorizations/verification', http, baseApi);
    this.forgotPassword = new GenericApi<any>('users/resend', http, baseApi);
    this.resetPassword = new GenericApi<any>('users/setPassword', http, baseApi);
    this.completeSignup = new GenericApi<any>('authorizations/completeSignup', http, baseApi);
  }

}
