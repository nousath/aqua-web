import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { IApi } from '../../common/contracts/api/api.interface';
import { TimeLogs } from '../../models/time-logs';
import { GenericApi } from '../../common/generic-api';

@Injectable()
export class AmsTimelogsService {
  timeLogs: IApi<TimeLogs>
  locationBylatLng: IApi<any>

  constructor(private http: Http) {
    const baseApi = 'ams';

    this.timeLogs = new GenericApi<TimeLogs>('timeLogs', http, baseApi)
    this.locationBylatLng = new GenericApi<TimeLogs>('https://maps.googleapis.com/maps/api/geocode/json', http, baseApi)
  }

}
