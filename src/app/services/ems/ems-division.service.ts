import { Injectable } from '@angular/core';
import { IApi } from '../../common/ng-api/api.interface';
import { GenericApi } from '../../common/ng-api/generic-api';
import { Http } from '@angular/http';
import { Division } from '../../models/division';

@Injectable()
export class EmsDivisionService {

  divisions: IApi<Division>;

  constructor(private http: Http) {
    const baseApi = 'ems';

    this.divisions = new GenericApi<Division>('divisions', http, baseApi);
  }

}
