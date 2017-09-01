import { Injectable } from '@angular/core';
import { IApi } from '../../common/contracts/api/api.interface';
import { Http } from '@angular/http';
import { GenericApi } from '../../common/generic-api';
import { Category, Device, DeviceLogs } from '../../models';

@Injectable()
export class AmsDeviceService {

  devices: IApi<Device>;
  categories: IApi<Category>;
  deviceLogs: IApi<DeviceLogs>;

  constructor(private http: Http) {
    const baseApi = 'ams';

    this.devices = new GenericApi<Device>('devices', http, baseApi);
    this.deviceLogs = new GenericApi<DeviceLogs>('deviceLogs', http, baseApi);
    this.categories = new GenericApi<Category>('categories', http, baseApi);
  }

}
