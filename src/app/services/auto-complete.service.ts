import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { User } from '../models/user';
import { ServerPageInput } from '../common/contracts/api/page-input';
import * as _ from 'lodash';
import { LocalStorageService } from './local-storage.service';
import { environment } from '../../environments/environment';


@Injectable()
export class AutoCompleteService {

  constructor(public http: Http, private store: LocalStorageService) {
  }

  private getHeaders(apiName: string): Headers {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('x-tenant-code', 'aqua');

    const roleKey = window.localStorage.getItem('roleKey');
    if (roleKey) {
      headers.append('x-role-key', roleKey);
    }
    const externalToken = this.store.getItem('external-token');
    const amsToken = this.store.getItem('ams_token');
    const orgCode = this.store.getItem('orgCode');


    // let externalToken = this.store.getItem('externalToken');

    if (apiName === 'ams') {
      if (amsToken)
        headers.append('x-access-token', amsToken);
      if (externalToken)
        headers.append('external-token', externalToken);
      // else if (emsToken)
      //   headers.append('external-token', emsToken);

    } else if (apiName === 'ems') {
      // if (externalToken)
      //   headers.append('external-token', externalToken)
      if (externalToken)
        headers.append('x-access-token', externalToken);
    }


    headers.append('org-code', orgCode || 'msas'); // TODO
    return headers;
  }

  private getQueryParams(input: ServerPageInput): URLSearchParams {

    const params: URLSearchParams = new URLSearchParams();
    _.each(input, (value, key, obj) => {
      if (key === 'query') {
        _.each(value, (keyVal, keyKey) => {
          if (keyVal)
            params.set(keyKey, keyVal);
        });
      }
    });
    return params;
  }

  searchByKey<TModel>(key: string, value: string, apiName: string, apiKey: string, input?: ServerPageInput): Observable<TModel[]> {
    const params: URLSearchParams = new URLSearchParams();

    if (input) {
      _.each(input, (item, itemKey) => {
        if (itemKey === 'query') {
          _.each(item, (keyVal, keyKey) => {
            if (keyVal)
              params.set(keyKey, keyVal);
          });
        }
      });
    }

    // if (value) {
    value = value === 'init' ? null : value;


    params.set(key, value);
    return this.http.get(`${environment.apiUrls[apiName]}/api/${apiKey}`, { headers: this.getHeaders(apiName), search: params })
      .map(res => {
        const json = res.json().items as TModel[];
        return json;
      }).catch(
        err => {
          return Observable.of([]);
        }
      );
    // } else {
    //   return Observable.of([]);
    // }
  }
}



