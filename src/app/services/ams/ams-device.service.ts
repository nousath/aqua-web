import { Injectable } from '@angular/core';
import { IApi } from '../../common/contracts/api/api.interface';
import { Http } from '@angular/http';
import { GenericApi } from '../../common/generic-api';
import { Category, Device, DeviceLogs } from '../../models';
import { Biometric } from '../../models/biometric.model';

@Injectable()
export class AmsDeviceService {

  devices: IApi<Device>;
  deviceTypes: IApi<Device>;
  categories: IApi<Category>;
  deviceLogs: IApi<DeviceLogs>;
  biometrics: IApi<Biometric>;

  constructor(private http: Http) {
    const baseApi = 'ams';

    this.biometrics = new GenericApi<Biometric>('biometrics', http, baseApi);
    this.devices = new GenericApi<Device>('devices', http, baseApi);
    this.deviceLogs = new GenericApi<DeviceLogs>('deviceLogs', http, baseApi);
    this.deviceTypes = new GenericApi<Device>('deviceTypes', http, baseApi);
    this.categories = new GenericApi<Category>('categories', http, baseApi);
  }

}
