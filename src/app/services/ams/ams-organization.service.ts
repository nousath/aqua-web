import { Injectable } from '@angular/core';
import { IApi } from '../../common/contracts/api/api.interface';
import { GenericApi } from '../../common/generic-api';
import { Http, ResponseContentType } from '@angular/http';
import { Organization } from '../../models';

@Injectable()
export class AmsOrganizationService {

  organizations: IApi<Organization>;
  downloadSyncApp: IApi<ResponseContentType.Blob>

  constructor(private http: Http) {
    const baseApi = 'ams';

    this.organizations = new GenericApi<Organization>('organizations', http, baseApi);
    this.downloadSyncApp = new GenericApi<ResponseContentType.Blob>('binaries', http, baseApi);
  }

}
