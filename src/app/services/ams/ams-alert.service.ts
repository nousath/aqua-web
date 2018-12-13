import { Injectable } from '@angular/core';
import { IApi } from '../../common/contracts/api/api.interface';
import { AmsAlert, AlertType, ChannelType, Channel } from '../../models';
import { GenericApi } from '../../common/generic-api';
import { Http } from '@angular/http';

@Injectable()
export class AmsAlertService {

  alerts: IApi<AmsAlert>;
  alertTypes: IApi<AlertType>;
  subscribe: IApi<AmsAlert>;

  channelType: IApi<ChannelType>;
  channel: IApi<Channel>;

  constructor(private http: Http) {
    const baseApi = 'ams';

    this.alerts = new GenericApi<AmsAlert>('alerts', http, baseApi);
    this.subscribe = new GenericApi<AmsAlert>('alerts/subscribe', http, baseApi);
    this.alertTypes = new GenericApi<AlertType>('alertTypes', http, baseApi);

    this.channel = new GenericApi<Channel>('channels', http, baseApi);
    this.channelType = new GenericApi<ChannelType>('channelTypes', http, baseApi);
  }

}
