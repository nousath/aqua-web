import { Injectable } from '@angular/core';
import { IApi } from '../../common/ng-api/api.interface';
import { GenericApi } from '../../common/ng-api/generic-api';
import { Http } from '@angular/http';
import { Holiday } from '../../models';

@Injectable()
export class AmsHolidayService {

  holidays: IApi<Holiday>;

  constructor(private http: Http) {
    const baseApi = 'ams';

    this.holidays = new GenericApi<Holiday>('holidays', http, baseApi);
  }

}
