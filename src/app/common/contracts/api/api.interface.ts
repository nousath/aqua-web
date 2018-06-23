import { ServerPageInput } from './page-input';
import { ServerPageModel } from './server-page-model';
import { IGetParams } from './get-params.interface';
import { RemoteDataModel } from './remote-data.model';

export interface IApi<TModel> extends IUploader {
  get(id: number | string): Promise<TModel>;
  simpleGet(input?: IGetParams): Promise<any>;
  search(input: ServerPageInput): Promise<ServerPageModel<TModel>>;
  create(model: TModel, path?: string): Promise<TModel>;
  update(id: number | string, model: TModel, input?: ServerPageInput, path?: string): Promise<TModel>;
  remove(id: number | string): Promise<void>;
  simplePost(model: any): Promise<void>;
  exportReport(input: ServerPageInput, path?: string, reportName?: string): Promise<void>;
  all(type: any, id?: string, model?: any): Promise<void>;
  bulkCreate(models: TModel[], path?: string): Promise<RemoteDataModel>;
}


export interface IUploader {
  bulkUpload(file: File, format?: string, path?: string): Promise<string>;
}
