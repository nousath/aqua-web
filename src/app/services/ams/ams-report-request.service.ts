import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { ReportRequest } from '../../models/report-request';
import { IApi } from '../../common/contracts/api/api.interface';
import { GenericApi } from '../../common/generic-api';
import { ReportType } from '../../models';

@Injectable()
export class AmsReportRequestService {

  reportRequests: IApi<ReportRequest>;

  reportTypes: ReportType[] = [{
    type: 'daily-attendance',
    name: 'Daily Attendance',
    provider: 'ams'
  }, {
    type: 'monthly-attendance',
    name: 'Monthly Attendance (summary)',
    provider: 'ams'
  }, {
    type: 'attendance-details',
    name: 'Monthly Attendance (detailed)',
    provider: 'ams'
  }
  , {
    type: 'form-25',
    name: 'Form 25',
    provider: 'ams'
  },
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
  {
    type: 'employees-details',
    name: 'Employee Details',
    provider: 'ems'
  }
]

  constructor(private http: Http) {
    const baseApi = 'ams';

    this.reportRequests = new GenericApi<ReportRequest>('reportRequests', http, baseApi);
  }

}
