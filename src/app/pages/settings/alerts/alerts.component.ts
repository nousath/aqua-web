import { Component, OnInit } from '@angular/core';
import { AmsAlertService } from '../../../services';
import { ToastyService } from 'ng2-toasty';
import { ActivatedRoute, Router } from '@angular/router';
import { Page } from '../../../common/contracts/page';
import { AmsAlert } from '../../../models';
import { Model } from '../../../common/contracts/model';


@Component({
  selector: 'aqua-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.css']
})
export class AlertsComponent implements OnInit {

  alerts: Page<AmsAlert>;
  alert: Model<AmsAlert>;


  constructor(private amsAlertService: AmsAlertService,
    private toastyService: ToastyService,
    private activatedRoute: ActivatedRoute,
    private router: Router) {

    this.alerts = new Page({
      api: amsAlertService.alerts
    });

    this.alert = new Model({
      api: amsAlertService.alerts,
      properties: new AmsAlert()
    });

    this.fetchAlerts();

  }

  toggleStatus(alert: AmsAlert) {
    alert.status = alert.status === 'active' ? 'inactive' : 'active';
    this.alert.properties = alert;
    this.alert.save().catch(err => this.toastyService.error({ title: 'Error', msg: err }));
  }

  fetchAlerts() {
    this.alerts.fetch().catch(err => this.toastyService.error({ title: 'Error', msg: err }));
  }

  ngOnInit() {
  }

}
