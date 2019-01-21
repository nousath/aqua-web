import { Page } from './page.model';
import { PageOptions } from './page-options.model';
import { RemoteData } from './remote-data.model';


export interface IApi<TModel> extends IUploader {
  get(id: number | string): Promise<TModel>;
  search(input?: PageOptions): Promise<Page<TModel>>;
  create(model: any, path?: string): Promise<TModel>;
  update(id: number | string, model: any, input?: PageOptions, path?: string): Promise<TModel>;
  remove(id: number | string): Promise<void>;
  simplePost(model: any, key?: string): Promise<any>;
  exportReport(input: PageOptions, path?: string, reportName?: string): Promise<void>;
  all(type: any, id?: string, model?: any): Promise<void>;
  bulkCreate(models: any[], path?: string): Promise<RemoteData>;
}


export interface IUploader {
  bulkUpload(file: File, format?: string, path?: string): Promise<string>;
}
