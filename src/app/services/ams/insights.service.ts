import { GenericApi } from '../../common/generic-api';
import { IApi } from '../../common/contracts/api/api.interface';
import { Insight } from '../../models/insight.model';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { DailyInsightAlerts } from '../../models/daily-insight-alert';
import { Observer } from 'rxjs/Observer';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class InsightsService {
  insights: IApi<Insight>;
  dailyInsight: IApi<Insight>;
  alertInsights: IApi<DailyInsightAlerts>
  subscribe: IApi<Insight>;
  id: any;
  // date = new Date().toISOString;
  // dailyInsightUrl = `insights/${this.id}/daily/${this.date}`

  constructor(private http: Http) {
    const baseApi = 'ams';

    this.insights = new GenericApi<Insight>('insights', http, baseApi);
    // this.dailyInsight = new GenericApi<Insight>(this.dailyInsightUrl, http, baseApi);
  }

  getDaily(id: string, date: Date): Observable<any> {
    const subject = new Subject<any>();
    this.insights.get(`${id}/daily/${date}`).then(item => subject.next(item));
    return subject.asObservable();
  }

  //   updatingdailyInsightUrl(id, date){
  //     if(date){
  //       this.date = date;

  //     }
  //     this.id = id;
  //     this.dailyInsightUrl = `insights/${this.id}/daily/${this.date}`
  //     console.log(this.dailyInsightUrl);
  //   }
}
