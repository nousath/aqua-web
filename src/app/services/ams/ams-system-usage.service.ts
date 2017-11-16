import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { IApi } from '../../common/contracts/api/api.interface';
import { GenericApi } from '../../common/generic-api';
import { System } from '../../models/system';

@Injectable()
export class AmsSystemUsageService {

  systems: IApi<System>;

  constructor(private http: Http) {
    const baseApi = 'ams';

    this.systems = new GenericApi<System>('systems/usage', http, baseApi);
  }

}
