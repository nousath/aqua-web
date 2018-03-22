import { Injectable } from '@angular/core';
import { IApi } from '../../common/contracts/api/api.interface';
import { User, Employee, MonthAttendance, DayEvent } from '../../models';
import { Http } from '@angular/http';
import { GenericApi } from '../../common/generic-api';
import { DailyAttendance } from '../../models/daily-attendance';

@Injectable()
export class AmsEmployeeService {

  employees: IApi<Employee>;
  amsLogin: IApi<Employee>;
  employeesForAdmin: IApi<Employee>;
  syncEmployees: IApi<any>;
  signInViaExternalToken: IApi<Employee>;
  teamMembers: IApi<Employee>;


  constructor(private http: Http) {
    const baseApi = 'ams';

    this.signInViaExternalToken = new GenericApi<Employee>('employees/makeTunnel', http, baseApi);
    this.employees = new GenericApi<Employee>('employees', http, baseApi);
    this.amsLogin = new GenericApi<Employee>('employees/login', http, baseApi);
    this.employeesForAdmin = new GenericApi<Employee>('employees/forAdmin', http, baseApi);
    this.syncEmployees = new GenericApi<any>('employees/sync/updates', http, baseApi);
    this.teamMembers = new GenericApi<any>('teams/my/teamMembers', http, baseApi);

  }
}
