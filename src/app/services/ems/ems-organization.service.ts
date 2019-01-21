import { Injectable } from '@angular/core';
import { IApi } from '../../common/ng-api/api.interface';
import { Http } from '@angular/http';
import { GenericApi } from '../../common/ng-api/generic-api';
import { Organization } from '../../models/organization';

@Injectable()
export class EmsOrganizationService {

  organizations: IApi<Organization>;

  constructor(private http: Http) {
    const baseApi = 'ems';
    this.organizations = new GenericApi<Organization>('organizations', http, baseApi);
  }

}
