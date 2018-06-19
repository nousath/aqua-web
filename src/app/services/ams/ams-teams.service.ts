import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { IApi } from '../../common/contracts/api/api.interface';
import { MonthAttendance, DailyAttendance, DayEvent } from '../../models';
import { GenericApi } from '../../common/generic-api';

@Injectable()
export class AmsTeamsService {

  donwloadMonthlyAttendances: IApi<any>;
  donwloadDailyAttendances: IApi<any>;
  donwloadSingleEmpMonthAtte: IApi<any>;

  teamAttendance: IApi<DayEvent>;

  constructor(private http: Http) {
    const baseApi = 'ams';

    this.teamAttendance = new GenericApi<DayEvent>('/teams/{id}/teamMembers', http, baseApi);

  }

}
