import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { GenericApi } from '../../common/ng-api/generic-api';
import { Channel, ChannelType } from '../../models';
import { IApi } from '../../common/ng-api/api.interface';



@Injectable()
export class AmsCommunicationAppsService {

  channelType: IApi<ChannelType>;
  channel: IApi<Channel>;

  constructor(private http: Http) {
    const baseApi = 'ams';

    this.channel = new GenericApi<Channel>('channels', http, baseApi);
    this.channelType = new GenericApi<ChannelType>('channelTypes', http, baseApi);

  }

}
