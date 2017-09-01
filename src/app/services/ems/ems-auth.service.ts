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
    this.signin = new GenericApi<any>('authorizations/signIn', http, baseApi);
    this.signup = new GenericApi<any>('authorizations/signUp', http, baseApi);
    this.verify = new GenericApi<any>('authorizations/verification', http, baseApi);
    this.forgotPassword = new GenericApi<any>('authorizations/forgotPassword', http, baseApi);
    this.resetPassword = new GenericApi<any>('authorizations/resetPassword', http, baseApi);
    this.completeSignup = new GenericApi<any>('authorizations/completeSignup', http, baseApi);
  }

}
