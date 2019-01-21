import { Component, OnInit } from '@angular/core';
import { AmsCommunicationAppsService } from '../../../services/ams/ams-communication-apps.service';
import { Channel, ChannelType } from '../../../models';
import { PagerModel } from '../../../common/ng-structures';
import { ToastyService } from 'ng2-toasty';
import { Router } from '@angular/router';




@Component({
  selector: 'aqua-channel-types',
  templateUrl: './channel-types.component.html',
  styleUrls: ['./channel-types.component.css'],
  providers: [AmsCommunicationAppsService]
})
export class ChannelTypesComponent implements OnInit {

  emailChannelTypes: PagerModel<ChannelType>;
  smsChannelTypes: PagerModel<ChannelType>;
  chatChannelTypes: PagerModel<ChannelType>;
  orgChannelTypes;
  isSubscribing: boolean;

  constructor(private amsCommunicationAppService: AmsCommunicationAppsService,
    private toastyService: ToastyService,
    private route: Router,
  ) {

    this.emailChannelTypes = new PagerModel({
      api: amsCommunicationAppService.channelType,
      filters: [{
        field: 'category',
        value: 'email'
      }]
    })
    this.smsChannelTypes = new PagerModel({
      api: amsCommunicationAppService.channelType,
      filters: [{
        field: 'category',
        value: 'sms'
      }]
    })
    this.chatChannelTypes = new PagerModel({
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
    this.route.navigate([`/settings/channelTypes`, item.id]);
  }

  ngOnInit() {
  }

}
