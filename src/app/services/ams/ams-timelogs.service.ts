import { Injectable } from '@angular/core';
import { IApi } from 'app/common/contracts/api';
import { TimeLogs } from 'app/models';
import { Http } from '@angular/http';
import { GenericApi } from 'app/common/generic-api';

@Injectable()
export class AmsTimelogsService {
  timeLogs: IApi<TimeLogs>

  constructor(private http: Http) {
    const baseApi = 'ams';

    this.timeLogs = new GenericApi<TimeLogs>('timeLogs', http, baseApi)
  }

}
