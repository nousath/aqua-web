import { Component, OnInit } from '@angular/core';
import { AmsAlertService } from '../../../services';
import { ToastyService } from 'ng2-toasty';
import { Router } from '@angular/router';
import { Page } from '../../../common/contracts/page';
import { AlertType } from '../../../models';
import * as _ from 'lodash';
import { AlertParameter } from '../../../models/alert';

@Component({
  selector: 'aqua-alter-types',
  templateUrl: './alter-types.component.html',
  styleUrls: ['./alter-types.component.css']
})
export class AlterTypesComponent implements OnInit {

  alterTypes: Page<AlertType>

  constructor(private amsAlertService: AmsAlertService,
    private toastyService: ToastyService,
    private router: Router) {

    this.alterTypes = new Page({
      api: amsAlertService.alertTypes
    })

    this.alterTypes.fetch(
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


  isSubscribing: boolean = false;
  subscribe(alertTypeId: string) {
    this.isSubscribing = true;
    this.amsAlertService.subscribe.update(alertTypeId, null).then(
      data => {
        this.isSubscribing = false;
        this.router.navigate([`/pages/settings/alerts/${data['id']}`]);
      }
    ).catch(err => {
      this.isSubscribing = false;
      this.toastyService.error({ title: 'Error', msg: err });
    })
  }


  ngOnInit() {
  }

}
