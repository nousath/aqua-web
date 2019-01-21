import { Component, OnInit } from '@angular/core';
import { AmsAlertService } from '../../../services';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastyService } from 'ng2-toasty';
import { AmsAlert } from '../../../models';
import { DetailModel } from '../../../common/ng-structures';
import { Subscription } from 'rxjs/Rx';
import * as _ from 'lodash';
import { AlertParameter } from '../../../models/alert-parameter.model';
import { ValidatorService } from '../../../services/validator.service';
import { Angulartics2 } from 'angulartics2';

interface IValue {
  prop: string
}

interface MyType {
  [name: string]: IValue;
}

@Component({
  selector: 'aqua-alter-edit',
  templateUrl: './alter-edit.component.html',
  styleUrls: ['./alter-edit.component.css']
})
export class AlterEditComponent implements OnInit {

  alert: DetailModel<AmsAlert>;
  subscription: Subscription;
  reset: Function;
  resetConfig: Boolean = false;

  constructor(private amsAlertService: AmsAlertService,
    private toastyService: ToastyService,
    public validatorService: ValidatorService,
    private activatedRoute: ActivatedRoute,
    private angulartics2: Angulartics2,
    private router: Router) {

    this.alert = new DetailModel({
      api: amsAlertService.alerts,
      properties: new AmsAlert()
    });

    this.reset = () => {
      // if (this.alert.properties.config.processor['channel']){

      // }
      this.resetConfig = true;
      this.alert.properties.config.processor['channel'] = '';
      this.resetConfig = false;

    }

    this.subscription = activatedRoute.params.subscribe(
      params => {

        this.alert.fetch(params['id']).then(
          data => {
            // _.each(this.alert.properties.alertType.trigger.parameters, (i: AlertParameter) => {
            //   i.type = i.type.toLowerCase();
            // });
            if (!this.alert.properties.config.processor) {
              this.alert.properties.config['processor'] = { 'channel': '' };
            }
          }
        ).catch(err => toastyService.error({ title: 'Error', msg: err }));
      }
    );

  }

  configure() {
    this.angulartics2.eventTrack.next({ action: 'alertClick', properties: { category: 'alertConfigurations' } });
    const trigger: any = {};
    _.each(this.alert.properties.alertType.trigger.parameters, (i: AlertParameter) => {
      trigger[i.name] = i.value
    });
    this.alert.properties.config.trigger = trigger;
    this.alert.save().then(
      data => {
        this.router.navigate([`/settings/alerts`]);
      }
    ).catch(err => this.toastyService.error({ title: 'Error', msg: err }));


  }
  ngOnInit() {
  }

}
