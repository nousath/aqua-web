import { Component, OnInit } from '@angular/core';
import { AmsCommunicationAppsService } from "../../../services/ams/ams-communication-apps.service";
import { Channel, ChannelType } from '../../../models';
import { Page } from "../../../common/contracts/page";
import { ToastyService } from 'ng2-toasty';
import { Router } from "@angular/router";


@Component({
  selector: 'aqua-channel-types',
  templateUrl: './channel-types.component.html',
  styleUrls: ['./channel-types.component.css'],
  providers: [AmsCommunicationAppsService]
})




export class ChannelTypesComponent implements OnInit {

  emailChannelTypes: Page<ChannelType>;
  smsChannelTypes: Page<ChannelType>;
  chatChannelTypes: Page<ChannelType>;
  orgChannelTypes;

  constructor(private amsCommunicationAppService: AmsCommunicationAppsService,
    private toastyService: ToastyService,
    private route: Router
  ) {

    this.emailChannelTypes = new Page({
      api: amsCommunicationAppService.channelType,
      filters: [{
        field: 'category',
        value: 'email'
      }]
    })
    this.smsChannelTypes = new Page({
      api: amsCommunicationAppService.channelType,
      filters: [{
        field: 'category',
        value: 'sms'
      }]
    })
    this.chatChannelTypes = new Page({
      api: amsCommunicationAppService.channelType,
      filters: [{
        field: 'category',
        value: 'chat'
      }]
    })

    this.getSMSChannelTypes();
    this.getEmailChannelTypes();
    this.getChatChannelTypes();
  }

  getSMSChannelTypes() {
    this.smsChannelTypes
      .fetch()
      .catch(err => this.toastyService.error({ title: 'Error', msg: err }));
  }

  getEmailChannelTypes() {
    this.emailChannelTypes
      .fetch()
      .catch(err => this.toastyService.error({ title: 'Error', msg: err }));
  }

  getChatChannelTypes() {
    this.chatChannelTypes
      .fetch()
      .catch(err => this.toastyService.error({ title: 'Error', msg: err }));
  }
  
  add(item) {
    this.route.navigate([`/pages/settings/channelTypes`,item.id]);
  }

  ngOnInit() {
  }

}
