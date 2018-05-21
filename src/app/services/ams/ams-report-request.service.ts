import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { ReportRequest } from '../../models/report-request';
import { IApi } from '../../common/contracts/api/api.interface';
import { GenericApi } from '../../common/generic-api';

@Injectable()
export class AmsReportRequestService {

  reportRequests: IApi<ReportRequest>;

  constructor(private http: Http) {
    const baseApi = 'ams';

    this.reportRequests = new GenericApi<ReportRequest>('reportRequests', http, baseApi);
   }

}
