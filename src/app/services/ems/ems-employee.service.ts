import { Injectable } from '@angular/core';
import { IApi } from '../../common/ng-api/api.interface';
import { Http } from '@angular/http';
import { GenericApi } from '../../common/ng-api/generic-api';
import { User } from '../../models';
import { Employee } from '../../models';
import { EmsEmployee } from '../../models/ems/employee';



@Injectable()
export class EmsEmployeeService {

  employees: IApi<EmsEmployee>;
  signIn: IApi<User>;
  signInViaExternalToken: IApi<User>;
  resendCode: IApi<User>;
  validateCode: IApi<User>;

  constructor(private http: Http) {
    const baseApi = 'ems';

    this.employees = new GenericApi<EmsEmployee>('employees', http, baseApi);
    this.signIn = new GenericApi<User>('employees/signIn', http, baseApi);
    this.signInViaExternalToken = new GenericApi<User>('employees/makeTunnel', http, baseApi);
    this.resendCode = new GenericApi<any>('employees/resendCode', http, baseApi);
    this.validateCode = new GenericApi<any>('', http, baseApi);
  }

}
