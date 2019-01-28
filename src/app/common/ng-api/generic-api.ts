import { Http, Headers, RequestOptions, Response, URLSearchParams, ResponseContentType } from '@angular/http';
import * as _ from 'lodash';
import { environment } from '../../../environments/environment';
import { RemoteData } from './remote-data.model';
import { FileUploader, FileItem } from 'ng2-file-upload';
import { IApi, PageOptions } from '.';
import { ServerData } from './server-data.model';
import { Page } from './page.model';

export class GenericApi<TModel> implements IApi<TModel> {

  private rootUrl: string;

  private getHeaders(): Headers {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const orgCode = window.localStorage.getItem('org-code') || window.localStorage.getItem('orgCode');
    const roleKey = window.localStorage.getItem('role-key') || window.localStorage.getItem('roleKey');

    headers.append('x-tenant-code', 'aqua');

    if (roleKey) {
      headers.append('x-role-key', roleKey);
    }

    if (orgCode) {
      headers.append('org-code', orgCode);
    }

    if (this.headers && this.headers.length) {
      this.headers.forEach(item => {
        headers.append(item.key, item.value)
      })
    }

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

  private getQueryParams(input?: PageOptions): URLSearchParams {

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
        const dataModel = response.json() as ServerData<TModel>;

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

  search(input?: PageOptions): Promise<Page<TModel>> {
    const params: URLSearchParams = this.getQueryParams(input);
    return this.http.get(`${this.rootUrl}/${this.key}`, { headers: this.getHeaders(), search: params })
      .toPromise()
      .then((response) => {
        const dataModel = response.json() as Page<TModel>;

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

  create(model: any, path?: string): Promise<TModel> {

    let url = `${this.rootUrl}/${this.key}`;
    url = path ? `${url}/${path}` : url;

    return this.http.post(url, model, { headers: this.getHeaders() })
      .toPromise()
      .then((response) => {
        const dataModel = response.json() as ServerData<TModel>;

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

  bulkCreate(models: any[], path?: string): Promise<RemoteData> {

    let url = `${this.rootUrl}/${this.key}`;
    url = path ? `${url}/${path}` : `${url}/bulk`;

    return this.http.post(url, { items: models }, { headers: this.getHeaders() })
      .toPromise()
      .then((response) => {
        const dataModel = response.json() as RemoteData;

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
        const dataModel = JSON.parse(response) as RemoteData;

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

  exportReport(input: PageOptions, path?: string, reportName?: string): Promise<any> {
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

  update(id: number | string, model: any, input?: PageOptions, path?: string): Promise<TModel> {
    let params: URLSearchParams;
    if (input) {
      params = this.getQueryParams(input);
    }
    const url = path ? `${this.rootUrl}/${this.key}/${id}/${path}` : `${this.rootUrl}/${this.key}/${id}`;
    return this.http.put(url, model, { headers: this.getHeaders(), search: params })
      .toPromise()
      .then((response) => {
        const dataModel = response.json() as ServerData<TModel>;

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
        const dataModel = response.json() as ServerData<TModel>;

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
    private headers?: {
      key: string,
      value: string
    }[]) {

    let apiUrls = {}
    const stringified = localStorage.getItem('api-urls')
    if (stringified) {
      apiUrls = JSON.parse(stringified)
    }
    if (apiUrls[apiName]) {
      this.rootUrl = apiUrls[apiName]
    } else {
      this.rootUrl = `${environment.apiUrls[apiName] || apiName}/api`;
      apiUrls[apiName] = this.rootUrl;
      localStorage.setItem('api-urls', JSON.stringify(apiUrls))
    }
  }
}
