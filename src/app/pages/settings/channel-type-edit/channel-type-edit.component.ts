import { Component, OnInit, OnDestroy } from '@angular/core';
import { AmsCommunicationAppsService } from "../../../services/ams/ams-communication-apps.service";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { ToastyService } from 'ng2-toasty';
import { Channel, ChannelType, ChannelTypeParams } from '../../../models';
import { Subscription } from "rxjs/Subscription";
import { Model } from "../../../common/contracts/model";
import * as _ from 'lodash';


@Component({
  selector: 'aqua-channel-type-edit',
  templateUrl: './channel-type-edit.component.html',
  styleUrls: ['./channel-type-edit.component.css'],
  providers: [AmsCommunicationAppsService]
})
export class ChannelTypeEditComponent implements OnInit {

  channelType: ChannelType;
  channel: Channel = new Channel();




  constructor(private amsCommunicationAppService: AmsCommunicationAppsService,
    private activatedRoute: ActivatedRoute,
    private toastyService: ToastyService,
    private router: Router) {

    this.activatedRoute.params.subscribe((params: Params) => {
      this.amsCommunicationAppService.channelType.get(params.id)
        .then(data => {
          this.channelType = data;
        })
        .catch(err => {
          toastyService.error({ title: 'Error', msg: err });
        })
    });
  }

  configureChannel(item) {

    this.channel.type = item;
    console.log(this.channel);

    _.each(item.parameters, (param: ChannelTypeParams) => {
      if (param.value) {
        this.channel.config[param.name] = param.value;
      }
    });

    this.amsCommunicationAppService.channel.simpePost(this.channel)
      .then(data => {
        this.router.navigateByUrl("/pages/settings/channelTypes");
        console.log(data);
      })
      .catch(err => {
        console.log(err);
        this.toastyService.error({ title: 'Error', msg: err });
      })
  };

  updateChannel(item) {

    this.channel = item.channel;

    _.each(item.parameters, (param: ChannelTypeParams) => {
      if (param.value) {
        this.channel.config[param.name] = param.value;
      }
    });

    this.amsCommunicationAppService.channel.update(this.channel.id,this.channel)
      .then(data => {
        this.router.navigateByUrl("/pages/settings/channelTypes");
        this.toastyService.info({ title: 'Information', msg: 'Saved Successfully' });        
      })
      .catch(err => {
        this.toastyService.error({ title: 'Error', msg: err });
      })
  }


  ngOnInit() {
  }
















  // ngOnDestroy() {
  //   this.subscription.unsubscribe();
  // }

}
