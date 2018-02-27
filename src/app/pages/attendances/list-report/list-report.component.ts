import { Insight } from './../../../models/insight.model';
import { ReportFiltersComponent } from './../../../shared/components/report-filters/report-filters.component';
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
  constructor(private amsInsightService: InsightsService,
    private toastyService: ToastyService,
    public validatorService: ValidatorService,
    private activatedRoute: ActivatedRoute,
    private angulartics2: Angulartics2,
    private router: Router) {

    this.alerts = new Page({
      api: amsInsightService.Insights
    });


    this.alert = new Model({
      api: amsInsightService.Insights,
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

  clear() { }

}






