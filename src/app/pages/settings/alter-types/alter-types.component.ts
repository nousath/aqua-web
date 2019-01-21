import { Component, OnInit } from '@angular/core';
import { AmsAlertService } from '../../../services';
import { ToastyService } from 'ng2-toasty';
import { Router } from '@angular/router';
import { PagerModel } from '../../../common/ng-structures';
import { AlertType } from '../../../models';
import * as _ from 'lodash';
import { AlertParameter } from '../../../models/alert-parameter.model';

@Component({
  selector: 'aqua-alter-types',
  templateUrl: './alter-types.component.html',
  styleUrls: ['./alter-types.component.css']
})
export class AlterTypesComponent implements OnInit {

  alterTypes: PagerModel<AlertType>

  constructor(private amsAlertService: AmsAlertService,
    private toastyService: ToastyService,
    private router: Router) {

    this.alterTypes = new PagerModel({
      api: amsAlertService.alertTypes
    })

    this.alterTypes.fetch().then(
      data => {
        // _.each(this.alterTypes.items, (item: AlertType) => {
        //   _.each(item.processor.parameters, (i: AlertParameter) => {
        //     i['keyValue'] = '';
        //   });
        //   _.each(item.trigger.parameters, (i: AlertParameter) => {
        //     i['keyValue'] = '';
        //   });
        // });
      }
    ).catch(err => toastyService.error({ title: 'Error', msg: err }));
  }


  isSubscribing = false;
  subscribe(alertTypeId: string) {
    this.isSubscribing = true;
    this.amsAlertService.subscribe.update(alertTypeId, null).then(
      data => {
        this.isSubscribing = false;
        this.router.navigate([`/settings/alerts/${data['id']}`]);
      }
    ).catch(err => {
      this.isSubscribing = false;
      this.toastyService.error({ title: 'Error', msg: err });
    })
  }


  ngOnInit() {
  }

}
