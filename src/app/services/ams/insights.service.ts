import { GenericApi } from './../../common/generic-api';
import { IApi } from './../../common/contracts/api/api.interface';
import { Insight } from './../../models/insight.model';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { DailyInsightAlerts } from '../../models/daily-insight-alert';

@Injectable()
export class InsightsService {
Insights: IApi<Insight>;
alertInsights: IApi<DailyInsightAlerts>
subscribe: IApi<Insight>;

  constructor(private http: Http) {
    const baseApi = 'ams';

this.Insights = new GenericApi<Insight>('Insights', http, baseApi);
this.alertInsights = new GenericApi<DailyInsightAlerts>('alertInsights', http, baseApi);
this.subscribe = new GenericApi<Insight>('insights/subscribe', http, baseApi);
  }
}
