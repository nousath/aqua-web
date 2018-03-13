import { LocalStorageService } from './../../../services/local-storage.service';
import { Filter } from './../../../common/contracts/filters';
import { Tags } from './../daily/daily.component';
import { TagType } from './../../../models/tag';
import { ShiftType } from './../../../models/shift-type';
import { Insight } from './../../../models/insight.model';
// import { ReportFiltersComponent } from './../../../shared/components/report-filters/report-filters.component';
import { Component, OnInit } from '@angular/core';
import { InsightsService } from '../../../services';

import { Router, ActivatedRoute } from '@angular/router';
import { ToastyService } from 'ng2-toasty';
import { Model } from '../../../common/contracts/model';
import { Subscription } from 'rxjs/Rx';
import * as _ from 'lodash';
import { AlertParameter } from '../../../models/alert-parameter.model';
import { ValidatorService } from '../../../services/validator.service';
import { Angulartics2 } from 'angulartics2';
import { Page } from '../../../common/contracts/page';
import { Http, Headers } from '@angular/http';

export interface SelectedTag {
  tagId: string;
  tagTypeId: string;
}

interface IValue {
  prop: string
}

interface MyType {
  [name: string]: IValue;
}

@Component({
  selector: 'aqua-list-report',
  templateUrl: './list-report.component.html',
  styleUrls: ['./list-report.component.css']
})
export class ListReportComponent implements OnInit {
  alerts: Page<Insight>;
  alert: Model<Insight>;
  subscription: Subscription;
  isLoading = false;
  shiftTypes: Page<ShiftType>;
  alertId: any;
  tagTypes: Page<TagType>;
  tags: Tags = new Tags();
  date: Date = null;
  ofDate: any;
  isDownloading = false;


  constructor(private amsInsightService: InsightsService,
    private toastyService: ToastyService,
    public validatorService: ValidatorService,
    private activatedRoute: ActivatedRoute,
    private store: LocalStorageService,
    private angulartics2: Angulartics2,
    private http: Http,
    private router: Router) {




    this.alert = new Model({
      api: amsInsightService.insights,
      properties: new Insight()
    });



    this.subscription = activatedRoute.params.subscribe(
      params => {
        this.isLoading = true;
        const alertId: string = params['id'];
        const ofDate = new Date();

        this.amsInsightService.getDaily(alertId, ofDate).subscribe((data) => {
          this.isLoading = false;
        })


        // this.alert.fetch(alertId).then(
        //   data => {
        //     // _.each(this.alert.properties.alertType.trigger.parameters, (i: AlertParameter) => {
        //     //   i.type = i.type.toLowerCase();
        //     // });
        //     if (!this.alert.properties.config.processor) {
        //       this.alert.properties.config['processor'] = { 'channel': '' };
        //     }
        //     this.isLoading = false;
        //   }
        // ).catch(err => toastyService.error({ title: 'Error', msg: err }));
      }
    );

  }


  getHeaders(): Headers {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const amsToken = window.localStorage.getItem('ams_token');
    const orgCode = window.localStorage.getItem('orgCode');

      if (amsToken) {
        headers.append('x-access-token', amsToken);
      }

    headers.append('org-code', orgCode);

    return headers;
  }
  ngOnInit() {
  }

  clear() { }

}






