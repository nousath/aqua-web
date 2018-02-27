import { insights } from './../../../models/insights';
import { AlertType } from './../../../models/alert-type';
import { Component, OnInit } from '@angular/core';
import { AmsAlertService } from '../../../services';
import { ToastyService } from 'ng2-toasty';
import { ActivatedRoute, Router } from '@angular/router';
import { Page } from '../../../common/contracts/page';
import { AmsAlert } from '../../../models';
import { Model } from '../../../common/contracts/model';
import { InsightsService } from '../../../services/ams/insights.service';


@Component({
  selector: 'aqua-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  insights: Page<insights>;
  insight: Model<insights>; 
  


  constructor(private amsInsightService: InsightsService,
    private toastyService: ToastyService,
    private activatedRoute: ActivatedRoute,
    private router: Router) {

    this.insights = new Page({ 
      api: amsInsightService.Insights
    });

    this.insight = new Model({
      api: amsInsightService.Insights,   
      properties: new insights()
    });
      
    this.fetchAlerts();
  }
  


  fetchAlerts() {
    this.insights.fetch().catch(err => this.toastyService.error({ title: 'Error', msg: err }));
  }
  
  ngOnInit() {
  }

}
