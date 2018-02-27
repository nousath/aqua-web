import { DailyInsightAlerts} from './../../models/daily-insight-alert';
import { DailyInsight } from './../../models/daily-insight';
import { Http } from '@angular/http';
import { IApi } from './../../common/contracts/api/api.interface';
import { GenericApi } from './../../common/generic-api';
import { Injectable } from '@angular/core';


@Injectable()
export class AmsDailyInsightService {
  dailytInsights: IApi<DailyInsight>;
  Alert: IApi<DailyInsightAlerts>;
  subscribe: IApi<DailyInsight>

  constructor(private http: Http) {
    const baseApi = 'ams';
    this.dailytInsights = new GenericApi<DailyInsight>('dailytInsights', http, baseApi);
    this.subscribe = new GenericApi<DailyInsight>('dailytInsights/subscribe', http, baseApi);
    this.Alert = new GenericApi<DailyInsightAlerts>('Alert', http, baseApi);
   }

}
