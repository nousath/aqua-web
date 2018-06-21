import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { IApi } from '../../common/contracts/api/api.interface';
import { MonthAttendance, DailyAttendance, DayEvent, Attendance } from '../../models';
import { GenericApi } from '../../common/generic-api';

@Injectable()
export class AmsAttendanceService {

  monthlyAttendances: IApi<MonthAttendance>;
  dailyAttendances: IApi<Attendance>;
  teamMember: IApi<DailyAttendance>;

  donwloadMonthlyAttendances: IApi<any>;
  donwloadDailyAttendances: IApi<any>;
  donwloadSingleEmpMonthAtte: IApi<any>;



  attendance: IApi<DayEvent>;

  constructor(private http: Http) {
    const baseApi = 'ams';
    const id = '';
    this.attendance = new GenericApi<DayEvent>('attendances', http, baseApi);
    this.monthlyAttendances = new GenericApi<MonthAttendance>('attendances/employee/month/summary', http, baseApi);
    this.dailyAttendances = new GenericApi<Attendance>('attendances/getOneDayAttendances', http, baseApi);
    this.teamMember = new GenericApi<any>(`teams/${id}/teamMembers`, http, baseApi);
    this.donwloadMonthlyAttendances = new GenericApi<any>('attendances/extractor', http, baseApi);
    this.donwloadDailyAttendances = new GenericApi<any>('attendances/dayReport', http, baseApi);
    this.donwloadSingleEmpMonthAtte = new GenericApi<any>('attendances/monthReport', http, baseApi);
  }

}
