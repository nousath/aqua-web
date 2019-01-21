import { Injectable } from '@angular/core';
import { IApi } from '../../common/ng-api/api.interface';
import { GenericApi } from '../../common/ng-api/generic-api';
import { Http, ResponseContentType } from '@angular/http';
import { Organization, User } from '../../models';
import { LocalStorageService } from '../local-storage.service';
import { Router } from '@angular/router';

@Injectable()
export class AmsOrganizationService {

  organizations: IApi<Organization>;
  downloadSyncApp: IApi<ResponseContentType.Blob>;

  constructor(
    private http: Http,
    private store: LocalStorageService,
    private router: Router
  ) {
    const baseApi = 'ams';

    this.organizations = new GenericApi<Organization>('organizations', http, baseApi);
    this.downloadSyncApp = new GenericApi<ResponseContentType.Blob>('binaries', http, baseApi);
  }

  nextStep(currentStep: 'start' | 'employees' | 'devices' | 'syncapp' | 'alerts' | 'complete', url?: string): Promise<Organization> {
    if (url)
      this.router.navigate([url]);

    const user: User = this.store.getObject('user') as User;
    if (!user.organization || !user.organization.id) {
      return Promise.reject('org not found');
    }
    user.organization['onBoardingStatus'] = currentStep;
    return this.organizations.update(user.organization.id, user.organization).then(
      data => {
        return Promise.resolve(data)
      }).catch(err => Promise.reject(err));
  }

}
