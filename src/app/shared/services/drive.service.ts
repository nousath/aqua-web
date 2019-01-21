import { Injectable } from '@angular/core';
import { FileUploader, FileItem } from 'ng2-file-upload';
import { RemoteData } from '../../common/ng-api/remote-data.model';
import { ServerData } from '../../common/ng-api';
import { Doc } from '../../models/doc.model';
import { environment } from '../../../environments/environment';
import { Entity } from '../../models/entity.model';

@Injectable()
export class DriveService {

  private rootUrl: string;

  constructor() {
    this.rootUrl = `${environment.apiUrls.drive}/api`;
  }

  upload(entity: Entity, file: File, folder?: string): Promise<Doc> {

    folder = folder || 'misc'

    const url = `${this.rootUrl}/${entity.type}/${entity.id}/files?folder-name=${folder}`;
    const orgCode = window.localStorage.getItem('org-code') || window.localStorage.getItem('orgCode');
    const roleKey = window.localStorage.getItem('role-key') || window.localStorage.getItem('roleKey');

    const headers = [{ name: 'x-tenant-code', value: 'aqua' }];
    if (roleKey) {
      headers.push({ name: 'x-role-key', value: roleKey });
    }
    if (orgCode) {
      headers.push({ name: 'x-org-code', value: orgCode });
    }

    const uploader = new FileUploader({
      url: url,
      headers: headers,
      autoUpload: true
    });

    uploader.onBeforeUploadItem = (item) => {
      item.file.name = item.file.name.replace(' ', '');
      item.withCredentials = false;
    }

    return new Promise((resolve, reject) => {
      uploader.onErrorItem = (item: FileItem, response: string, status: number) => {
        reject(new Error('failed'));
      }

      uploader.onCompleteItem = (item: FileItem, response: string, status: number) => {
        const dataModel = JSON.parse(response) as ServerData<Doc>;

        if (!dataModel.isSuccess) {
          if (status === 200) {
            return reject(dataModel.message || dataModel.error || dataModel.code || 'failed');
          } else {
            return reject(status);
          }
        }
        return resolve(dataModel.data);
      }

      uploader.addToQueue([file]);
    });
  }

}
