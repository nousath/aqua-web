import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response, URLSearchParams, ResponseContentType } from '@angular/http';
import 'rxjs';
import { Observable } from 'rxjs';
import { IApi, ServerDataModel, ServerPageInput, ServerPageModel } from './contracts/api';
import { ILocalStore } from './contracts/local-store-interface';
import * as _ from 'lodash';
import { ToastyService, ToastyConfig } from 'ng2-toasty';
import { IGetParams } from './contracts/api/get-params.interface';
import { environment } from '../../environments/environment';
import { RemoteDataModel } from './contracts/api/remote-data.model';
import { FileUploader, FileItem } from 'ng2-file-upload';

export class GenericApi<TModel> implements IApi<TModel> {

  private rootUrl: string;

  private getHeaders(): Headers {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const externalToken = window.localStorage.getItem('external-token');
    const amsToken = window.localStorage.getItem('ams_token');
    const orgCode = window.localStorage.getItem('orgCode');
    const roleKey = window.localStorage.getItem('roleKey');

    headers.append('x-tenant-code', 'aqua');

    if (roleKey) {
      headers.append('x-role-key', roleKey);
    }

    if (this.apiName === 'ams') {
      if (amsToken)
        headers.append('x-access-token', amsToken);
      if (externalToken)
        headers.append('external-token', externalToken);
      // else if (emsToken)
      //   headers.append('external-token', emsToken);

    } else if (this.apiName === 'ems') {
      // if (externalToken)
      //   headers.append('external-token', externalToken)
      if (externalToken)
        headers.append('x-access-token', externalToken);
    }


    headers.append('org-code', orgCode);

    return headers;
  }

  private handleError(error: any): Promise<any> {
    // console.log('error', error)
    if (error.status === 0) {

      return Promise.reject('Failed to connect to server')
    };
    if (error.status) {
      if (error.status === 401) {
        window.onbeforeunload = function () {
          console.log('blank function do nothing')
        }
        return;
        // return Promise.reject('Your are logged Out');
      }
      return Promise.reject(error.statusText);
    }
    return Promise.reject(error.message || error);
  }

  private getQueryParams(input?: ServerPageInput): URLSearchParams {

    const params: URLSearchParams = new URLSearchParams();
    if (!input) {
      return params
    }
    _.each(input, (value, key, obj) => {
      if (key === 'query') {
        _.each(value, (keyVal, keyKey) => {
          if (keyVal)
            params.set(keyKey, keyVal);
        });
      } else {
        params.set(key, value);
      }
    });
    return params
  }

  get(id: number | string): Promise<TModel> {
    return this.http.get(`${this.rootUrl}/${this.key}/${id}`, { headers: this.getHeaders() })
      .toPromise()
      .then((response) => {
        const dataModel = response.json() as ServerDataModel<TModel>;

        if (!dataModel.isSuccess) {
          if (response.status === 200) {
            return this.handleError(dataModel.message || dataModel.error || dataModel.code || 'failed');
          } else {
            return this.handleError(response.status);
          }
        }
        return dataModel.data;
      })
      .catch(this.handleError);
  }

  simpleGet(input?: IGetParams): Promise<TModel> {

    let url = `${this.rootUrl}/${this.key}`;
    let parms: URLSearchParams = null;

    if (input) {
      parms = input.serverPageInput ? this.getQueryParams(input.serverPageInput) : null;
      url = input.id ? `${url}/${input.id}` : url;
      url = input.path ? `${url}/${input.path}` : url;
      if (input.api) {
        url = input.api;
      }
    }


    return this.http.get(url, { headers: this.getHeaders(), search: parms })
      .toPromise()
      .then((response) => {
        const dataModel = response.json() as ServerDataModel<TModel>;

        if (!dataModel.isSuccess) {
          if (response.status === 200) {
            return this.handleError(dataModel.message || dataModel.error || dataModel.code || 'failed');
          } else {
            return this.handleError(response.status);
          }
        }
        return dataModel.data || dataModel.items;
      })
      .catch(this.handleError);
  }



  search(input?: ServerPageInput): Promise<ServerPageModel<TModel>> {
    const params: URLSearchParams = this.getQueryParams(input);
    return this.http.get(`${this.rootUrl}/${this.key}`, { headers: this.getHeaders(), search: params })
      .toPromise()
      .then((response) => {
        const dataModel = response.json() as ServerPageModel<TModel>;

        if (!dataModel.isSuccess) {
          if (response.status === 200) {
            return this.handleError(dataModel.message || dataModel.error || dataModel.code || 'failed');
          } else {
            return this.handleError(response.status);
          }
        }
        return dataModel;
      })
      .catch(this.handleError);
  }

  create(model: TModel, path?: string): Promise<TModel> {

    let url = `${this.rootUrl}/${this.key}`;
    url = path ? `${url}/${path}` : url;

    return this.http.post(url, model, { headers: this.getHeaders() })
      .toPromise()
      .then((response) => {
        const dataModel = response.json() as ServerDataModel<TModel>;

        if (!dataModel.isSuccess) {
          if (response.status === 200) {
            return this.handleError(dataModel.message || dataModel.error || dataModel.code || 'failed');
          } else {
            return this.handleError(response.status);
          }
        }
        return dataModel.data;
      })
      .catch(this.handleError);
  }

  bulkCreate(models: TModel[], path?: string): Promise<RemoteDataModel> {

    let url = `${this.rootUrl}/${this.key}`;
    url = path ? `${url}/${path}` : `${url}/bulk`;

    return this.http.post(url, { items: models }, { headers: this.getHeaders() })
      .toPromise()
      .then((response) => {
        const dataModel = response.json() as RemoteDataModel;

        if (!dataModel.isSuccess) {
          if (response.status === 200) {
            return this.handleError(dataModel.message || dataModel.error || dataModel.code || 'failed');
          } else {
            return this.handleError(response.status);
          }
        }
        return dataModel.message;
      })
      .catch(this.handleError);

  }

  bulkUpload(file: File, format?: string, path?: string): Promise<string> {

    let url = `${this.rootUrl}/${this.key}`;
    url = path ? `${url}/${path}` : `${url}/bulk`;

    if (format) {
      url = `${url}?format=${format}`;
    }

    const headers = [];

    this.getHeaders().forEach((values, name) => {
      if (name === 'Content-Type') {
        return;
      }
      values.forEach(value => {
        headers.push({
          name: name,
          value: value
        })
      });
    })

    const uploader = new FileUploader({
      url: url,
      headers: headers,
      autoUpload: true
    });

    uploader.onBeforeUploadItem = (item) => {
      item.withCredentials = false;
    }

    return new Promise((resolve, reject) => {

      uploader.onErrorItem = (item: FileItem, response: string, status: number) => {
        reject(new Error('failed'));
      }

      uploader.onCompleteItem = (item: FileItem, response: string, status: number) => {
        const dataModel = JSON.parse(response) as RemoteDataModel;

        if (!dataModel.isSuccess) {
          if (status === 200) {
            return reject(dataModel.message || dataModel.error || dataModel.code || 'failed');
          } else {
            return reject(status);
          }
        }
        return resolve(dataModel.message);
      }

      uploader.addToQueue([file]);
    });
  }

  exportReport(input: ServerPageInput, path?: string, reportName?: string): Promise<any> {
    const parms: URLSearchParams = this.getQueryParams(input);
    const apiPath: string = path ? `${this.rootUrl}/${path}` : `${this.rootUrl}/${this.key}`;

    return this.http.get(apiPath, { headers: this.getHeaders(), search: parms, responseType: ResponseContentType.Blob }).toPromise()
      .then((response) => {

        const contentType = response.headers.get('content-type') || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

        // get the headers' content disposition
        const cd = response.headers.get('content-disposition') || response.headers.get('Content-Disposition');

        // get the file name with regex
        const regex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const match = regex.exec(cd);

        // is there a file name?
        let fileName = match && match[1] || 'report';
        if (reportName) {
          fileName = reportName;
        }

        // replace leading and trailing slashes that C# added to your file name
        fileName = fileName.replace(/\"/g, '');

        const blob = new Blob([response['_body']], { type: contentType });
        if (navigator.msSaveBlob) {
          navigator.msSaveBlob(blob, fileName);
        } else {
          const objectUrl = window.URL.createObjectURL(blob);
          // window.open(objectUrl);
          const a = document.createElement('a');
          a.href = objectUrl;
          a.download = fileName;
          a.click();
          URL.revokeObjectURL(objectUrl);
          document.body.appendChild(a);
          document.body.removeChild(a);
        }
      })
      .catch(this.handleError);
  }

  simplePost(model: any, key?: string): Promise<any> {
    let url = `${this.rootUrl}/${this.key}`;
    if (key) {
      url = `${url}/${key}`
    }

    return this.http.post(url, model, { headers: this.getHeaders() })
      .toPromise()
      .then((response) => {
        const dataModel = response.json();

        if (!dataModel.isSuccess) {
          if (response.status === 200) {
            return this.handleError(dataModel.message || dataModel.error || dataModel.code || 'failed');
          } else {
            return this.handleError(response.status);
          }
        }
        return dataModel.data;
      })
      .catch(this.handleError);
  }

  all(type: any, id?: string, model?: any): Promise<any> {
    let url = `${this.rootUrl}/${this.key}`;
    if (id) {
      url = `${this.rootUrl}/${this.key}/${id}`
    }
    return this.http[type](url, model, { headers: this.getHeaders() })
      .toPromise()
      .then((response) => {
        const dataModel = response.json();
        if (!dataModel.isSuccess) {
          if (response.status === 200) {
            return this.handleError(dataModel.message || dataModel.error || dataModel.code || 'failed');
          } else {
            return this.handleError(response.status);
          }
        }
        return dataModel.data;
      })
      .catch(this.handleError);
  }

  update(id: number | string, model: TModel, input?: ServerPageInput, path?: string): Promise<TModel> {
    let parms: URLSearchParams;
    if (input) {
      parms = this.getQueryParams(input);
    }
    const url = path ? `${this.rootUrl}/${this.key}/${path}` : `${this.rootUrl}/${this.key}/${id}`;
    return this.http.put(url, model, { headers: this.getHeaders(), search: parms })
      .toPromise()
      .then((response) => {
        const dataModel = response.json() as ServerDataModel<TModel>;

        if (!dataModel.isSuccess) {
          if (response.status === 200) {
            return this.handleError(dataModel.message || dataModel.error || dataModel.code || 'failed');
          } else {
            return this.handleError(response.status);
          }
        }
        return dataModel.data;
      })
      .catch(this.handleError);
  }

  remove(id: number | string): Promise<void> {
    return this.http.delete(`${this.rootUrl}/${this.key}/${id}`, { headers: this.getHeaders() })
      .toPromise()
      .then((response) => {
        const dataModel = response.json() as ServerDataModel<TModel>;

        if (!dataModel.isSuccess) {
          if (response.status === 200) {
            return this.handleError(dataModel.message || dataModel.error || dataModel.code || 'failed');
          } else {
            return this.handleError(response.status);
          }
        }
        return dataModel.data;
      })
      .catch(this.handleError);
  }


  constructor(
    private key: string,
    private http: Http,
    private apiName: 'ems' | 'ams', // ems or ams
    private token?: string) {
    this.rootUrl = `${environment.apiUrls[apiName]}/api` || `${apiName}/api`;
  }
}
