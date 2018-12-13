import { Component, OnInit } from '@angular/core';
import { Page } from '../../../../common/contracts/page';
import { AmsAlert, Organization, AlertType, ChannelType, Channel, CurrentPage, ChannelTypeParams, CommAppConfig } from '../../../../models';
import { Model } from '../../../../common/contracts/model';
import { AmsAlertService, ValidatorService, AmsOrganizationService } from '../../../../services';
import { ToastyService } from 'ng2-toasty';
import { PushEventService } from '../../../../services/push-event.service';
import { AlertParameter } from '../../../../models/alert-parameter.model';


@Component({
  selector: 'ams-gs-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.css']
})
export class AlertsComponent implements OnInit {

  section: 'main' | 'configure' | 'channelType' | 'addChannelType' = 'main';

  alerts: Page<AmsAlert>;
  alert: Model<AmsAlert>;
  org: Model<Organization>;
  alterTypes: Page<AlertType>;
  channelTypes: Page<ChannelType>;
  channel: Model<Channel>;

  isSubscribing = false;


  constructor(private amsAlertService: AmsAlertService,
    public validatorService: ValidatorService,
    private toastyService: ToastyService,
    private amsOrganizationService: AmsOrganizationService,
    private pushEventService: PushEventService) {

    const page: CurrentPage = new CurrentPage();
    page.header = 'Add Alerts';
    page.description = 'You can add alerts to notify Supervisor';
    page.nextUrl = '/pages/wizard/complete';
    page.page = 'alerts';
    page.onBoardingStatus = 'alerts';
    pushEventService.pushPage(page);

    this.alerts = new Page({
      api: amsAlertService.alerts
    });

    this.alert = new Model({
      api: amsAlertService.alerts,
      properties: new AmsAlert()
    });

    this.org = new Model({
      api: amsOrganizationService.organizations,
      properties: new Organization()
    });

    this.alterTypes = new Page({
      api: amsAlertService.alertTypes
    });

    this.channel = new Model({
      api: amsAlertService.channel,
      properties: new Channel()
    });

    this.channelTypes = new Page({
      api: amsAlertService.channelType,
      filters: [{
        field: 'category',
        value: null
      }]
    })

    this.fetchAlerts();
    this.fetchOrg();


    this.alterTypes.fetch().catch(err => this.toastyService.error({ title: 'Error', msg: err }));


  }

  next() {
    this.amsOrganizationService.nextStep('alerts', '/pages/wizard/complete');
  }

  fetchAlerts() {
    this.alerts.fetch().catch(err => this.toastyService.error({ title: 'Error', msg: err }));
  }

  fetchOrg() {
    this.org.fetch('my').then(data => {

      if (!this.org.properties.communicationApps.sms) {
        this.org.properties.communicationApps['sms'] = { id: 'sms', isDummy: true, type: new ChannelType() };
      } else {
        this.org.properties.communicationApps.sms['isDummy'] = false
      }
      if (!this.org.properties.communicationApps.email) {
        this.org.properties.communicationApps['email'] = { id: 'email', isDummy: true, type: new ChannelType() };
      } else {
        this.org.properties.communicationApps.email['isDummy'] = false
      }
      if (!this.org.properties.communicationApps.chat) {
        this.org.properties.communicationApps['chat'] = { id: 'chat', isDummy: true, type: new ChannelType() };
      } else {
        this.org.properties.communicationApps.chat['isDummy'] = false
      }
    }
    ).catch(err => this.toastyService.error({ title: 'Error', msg: err }));
  }

  switchSectrion(section: 'main' | 'configure') {
    this.section = section;
  }

  fetchChannelTypes(category: string) {
    this.channelTypes.filters.properties['category'].value = category;
    this.channelTypes.fetch().then(data => {
      this.channelTypes.items.forEach((item: ChannelType) => {
        item.parameters.forEach((i: ChannelTypeParams) => {
          if (!i.value) {
            i['value'] = null;
          }
        });
      });
    }
    ).catch(err => this.toastyService.error({ title: 'Error', msg: err }));
  }

  checkCommApp(commApp: string) {
    if (this.org.properties.communicationApps[commApp].isDummy) {
      this.section = 'channelType';
      this.fetchChannelTypes(commApp);
    }
  }

  addChannelType(item: ChannelType) {
    this.section = 'addChannelType';
    this.channel.properties.type = item;
  }

  configChannel() {
    const config: any = {};
    const ifValueExist: ChannelTypeParams = this.channel.properties.type.parameters.find((i: ChannelTypeParams) => {
      return !i.value;
    })
    if (ifValueExist) {
      return this.toastyService.info({ title: 'Info', msg: `Enter value for ${ifValueExist.title}` });
    }
    this.channel.properties.type.parameters.forEach((i: ChannelTypeParams) => {
      if (i.value) {
        config[i.name] = i.value;
      }
    });
    this.channel.properties.config = config;
    this.channel.save().then(
      data => {
        this.fetchOrg();
        this.section = 'configure';
        this.alert.properties.config.processor['channel'] = null;
      }
    ).catch(err => this.toastyService.error({ title: 'Error', msg: err }));
  }

  subscribe(alertTypeId: string) {
    this.isSubscribing = true;
    this.amsAlertService.subscribe.update(alertTypeId, null).then(
      data => {
        this.isSubscribing = false;
        this.fetchAlert(data['id']);
        this.section = 'configure';
      }
    ).catch(err => {
      this.isSubscribing = false;
      this.toastyService.error({ title: 'Error', msg: err });
    })
  }

  fetchAlert(alertId: string) {
    this.alert.fetch(alertId).then(
      data => {
        if (!this.alert.properties.config.processor) {
          this.alert.properties.config['processor'] = { 'channel': '' };
        }
        this.section = 'configure';
      }
    ).catch(err => this.toastyService.error({ title: 'Error', msg: err }));
  }


  configure() {
    const trigger: any = {};
    const commApp: string = this.alert.properties.config.processor['channel'];

    const communicationApps = this.org.properties.communicationApps;
    const ifAppExist = communicationApps && communicationApps[commApp] && communicationApps[commApp].value === false;
    if (!ifAppExist) {
      return this.toastyService.info({ title: 'Info', msg: `Please Select Channel` });
    }
    this.alert.properties.alertType.trigger.parameters.forEach((i: AlertParameter) => {
      trigger[i.name] = i.value
    });

    this.alert.properties.config.trigger = trigger;
    this.alert.save().then(
      data => {
        this.section = 'configure';
        this.section = 'main';
        this.fetchAlerts();
      }
    ).catch(err => this.toastyService.error({ title: 'Error', msg: err }));


  }

  // breakLine(text: string): Array<string> {
  //   return this.validatorService.breakLine(text, 30);
  // }

  ngOnInit() {
  }

}
