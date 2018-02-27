import { GenericApi } from './../../common/generic-api';
import { IApi } from './../../common/contracts/api/api.interface';
import { insights } from './../../models/insights';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { DailyInsightAlerts } from '../../models/daily-insightAlert';

@Injectable()
export class InsightsService {
Insights:IApi<insights>;
alertInsights:IApi<DailyInsightAlerts>
subscribe:IApi<insights>;

  constructor(private http:Http) { 
    const baseApi='ams';
  
this.Insights=new GenericApi<insights>('Insights', http, baseApi);
this.alertInsights=new GenericApi<DailyInsightAlerts>('alertInsights',http,baseApi);
this.subscribe=new GenericApi<insights>('insights/subscribe',http,baseApi);
  }
}
