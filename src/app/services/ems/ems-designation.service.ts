import { Injectable } from '@angular/core';
import { IApi } from '../../common/ng-api/api.interface';
import { GenericApi } from '../../common/ng-api/generic-api';
import { Http } from '@angular/http';
import { Designation } from '../../models';

@Injectable()
export class EmsDesignationService {

  designations: IApi<Designation>;

  constructor(private http: Http) {
    const baseApi = 'ems';

    this.designations = new GenericApi<Designation>('designations', http, baseApi);
  }

}
