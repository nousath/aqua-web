import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { ReportRequest } from '../../models/report-request';
import { IApi } from '../../common/ng-api/api.interface';
import { GenericApi } from '../../common/ng-api/generic-api';
import { ReportType } from '../../models';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class AmsReportRequestService {

  reportRequests: IApi<ReportRequest>;

  reportTypes: ReportType[] = [{
    code: 'daily',
    icon: 'daily.svg',
    type: 'daily-attendance',
    name: 'Daily Attendance',
    provider: 'ams',
    area: 'attendances',
    filters: [
      'date',
      'name',
      'code',
      'designations',
      'departments',
      'userTypes',
      'contractors',
      'divisions',
      'supervisor',

      'shiftTypes',
      'attendanceStates',

      'clocked',
      'checkIn',
      'checkOut',
    ]
  }, {
    //   code: 'monthly',
    //   type: 'monthly-attendance',
    //   name: 'Monthly Attendance (summary)',
    //   provider: 'ams',
    //   area: 'attendance',
    // }, {
    code: 'monthly',
    icon: 'monthly.svg',
    type: 'attendance-details',
    name: 'Monthly Attendance',
    provider: 'ams',
    area: 'attendances',
    filters: [
      'month',
      'name',
      'code',
      'designations',
      'departments',
      'supervisor',
      'userTypes',
      'contractors',
      'divisions'
    ]
  }, {
    code: 'form-25',
    icon: 'form-25.svg',
    type: 'form-25',
    name: 'Form 25',
    provider: 'ams',
    area: 'attendances',
    filters: [
      'month',
      'name',
      'code',
      'designations',
      'departments',
      'supervisor',
      'userTypes',
      'contractors',
      'divisions'
    ]
  }, {
    code: 'monthly',
    icon: 'monthly.svg',
    type: 'leaves-monthly',
    name: 'Monthly Leaves',
    provider: 'ams',
    area: 'leaves',
    filters: [
      'month',
      'name',
      'code',
      'designations',
      'departments',
      'supervisor',
      'contractors',
      'divisions'
    ]
  }, {
    code: 'balance',
    icon: 'assignment.svg',
    type: 'leaves-balance',
    name: 'Leaves Balance',
    provider: 'ams',
    area: 'leaves',
    filters: [
      'month',
      'name',
      'code',
      'designations',
      'departments',
      'supervisor',
      'contractors',
      'divisions',
      'leaveTypes'
    ]
  }, {
    code: 'full',
    icon: 'full.svg',
    type: 'employees-details',
    name: 'Employee Details',
    provider: 'ems',
    area: 'employees',
    filters: [
      'employeeStatus',
      'name',
      'code',
      'biometricId',
      'joiningDate',
      'designations',
      'departments',
      'employeeTypes',
      'userTypes',
      'contractors',
      'divisions'
      // 'supervisor'
    ]
  }, {
    code: 'shifts',
    icon: 'shifts.svg',
    type: 'shift-types',
    name: 'Shift Details',
    provider: 'ams',
    area: 'shifts',
    filters: [
      'departments',
      // 'divisions'
      // 'supervisor'
    ]
  }]
  //  {
  //   type: 'daily-extra-hours-after-shift-end',
  //   name: 'Daily Extra Hours (after shift)',
  //   provider: 'ams'
  // }, {
  //   type: 'daily-extra-hours-after-shift-hours',
  //   name: 'Daily Extra Hours (net)',
  //   provider: 'ams'
  // }, {
  //   type: 'monthly-extra-hours-after-shift-end',
  //   name: 'Monthly Extra Hours (after shift)',
  //   provider: 'ams'
  // }, {
  //   type: 'monthly-extra-hours-after-shift-hours',
  //   name: 'Monthly Extra Hours (net)',
  //   provider: 'ams'
  // }, {
  //   type: 'monthly-late-check-in',
  //   name: 'Late Check-in (monthly)',
  //   provider: 'ams'
  // }, {
  //   type: 'monthly-early-check-out',
  //   name: 'Early Check-out (monthly)',
  //   provider: 'ams'
  // },


  constructor(private http: Http) {
    const baseApi = 'ams';

    this.reportRequests = new GenericApi<ReportRequest>('reportRequests', http, baseApi);
  }

  getByArea(area: string): Observable<ReportType[]> {
    const subject: Subject<ReportType[]> = new Subject();
    setTimeout(() => {
      subject.next(this.reportTypes.filter(item => item.area.toLowerCase() === area.toLowerCase()));
    }, 1);
    return subject.asObservable();
  }
}
