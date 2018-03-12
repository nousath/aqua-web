import { InsightsService } from './../../../services/ams/insights.service';
import { Insight } from './../../../models/insight.model';
// import { ReportFiltersComponent } from './../../../shared/components/report-filters/report-filters.component';
import { Component, OnInit } from '@angular/core';
import { AmsAlertService } from '../../../services';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastyService } from 'ng2-toasty';
import { AmsAlert } from '../../../models';
import { Model } from '../../../common/contracts/model';
import { Subscription } from 'rxjs/Rx';
import * as _ from 'lodash';
import { AlertParameter } from '../../../models/alert-parameter.model';
import { ValidatorService } from '../../../services/validator.service';
import { Angulartics2 } from 'angulartics2';
import { Page } from '../../../common/contracts/page';


interface IValue {
  prop: string
}

interface MyType {
  [name: string]: IValue;
}

@Component({
  selector: 'aqua-download-report',
  templateUrl: './download-report.component.html',
  styleUrls: ['./download-report.component.css']
})
export class DownloadReportComponent implements OnInit {
 
  alert: Model<Insight>;
  subscription: Subscription;
  isLoading= false;
  constructor(private amsInsightService: InsightsService,
    private toastyService: ToastyService,
    public validatorService: ValidatorService,
    private activatedRoute: ActivatedRoute,
    private angulartics2: Angulartics2,
    private router: Router) {

      // this.alerts = new Page({
      //   api: amsAlertService.alerts
      // });


      this.alert = new Model({
        api: amsInsightService.insights,
        properties: new Insight()
      });
  
    this.subscription = activatedRoute.params.subscribe(
      params => {
        this.isLoading = true;
        const alertId: string = params['id'];
        this.alert.fetch(alertId).then(
          data => {
            // _.each(this.alert.properties.alertType.trigger.parameters, (i: AlertParameter) => {
            //   i.type = i.type.toLowerCase();
            // });
            if (!this.alert.properties.config.processor) {
              this.alert.properties.config['processor'] = { 'channel': '' };
            }
            this.isLoading = false;
          }
        ).catch(err => toastyService.error({ title: 'Error', msg: err }));
      }
    );

  }
  
  ngOnInit() {
  }
  reportTab() {
   console.log('hiiiiiiiiiii')
  }
}






