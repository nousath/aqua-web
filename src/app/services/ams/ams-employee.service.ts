import { Injectable } from '@angular/core';
import { IApi } from '../../common/contracts/api/api.interface';
import { User, Employee, MonthAttendance, DayEvent } from '../../models';
import { Http } from '@angular/http';
import { GenericApi } from '../../common/generic-api';
import { DailyAttendance } from '../../models/daily-attendance';
import { ToastyService } from 'ng2-toasty';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class AmsEmployeeService {

  employees: IApi<Employee>;
  employeesForAdmin: IApi<Employee>;
  syncEmployees: IApi<any>;
  signInViaExternalToken: IApi<Employee>;
  teamMembers: IApi<Employee>;


  constructor(private http: Http, private toastyService: ToastyService) {
    const baseApi = 'ams';

    this.signInViaExternalToken = new GenericApi<Employee>('employees/makeTunnel', http, baseApi);
    this.employees = new GenericApi<Employee>('employees', http, baseApi);
    this.employeesForAdmin = new GenericApi<Employee>('employees/forAdmin', http, baseApi);
    this.syncEmployees = new GenericApi<any>('employees/sync/updates', http, baseApi);
    this.teamMembers = new GenericApi<any>('teams/my/teamMembers', http, baseApi);
  }

  toggleDynamicShift(employee): Observable<Employee> {
    const oldValue = employee.isDynamicShift;
    employee.isDynamicShift = !employee.isDynamicShift;
    const subject = new Subject<Employee>()
    this.employees.update(employee.id, employee).then((update) => {
      subject.next(update);
    }).catch(err => {
      employee.isDynamicShift = oldValue;
      subject.error(err)
      this.toastyService.error({ title: 'Error', msg: err })
    });

    return subject.asObservable()
  }
}
