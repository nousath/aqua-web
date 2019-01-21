import { DetailOptions } from './detail-options.model';
import { Input } from '@angular/core';

import { finalize, map } from 'rxjs/operators'
import { IApi } from '../../ng-api';
import { Observable } from 'rxjs/Observable';


export class DetailBase<TModel> {

  private originalModel: TModel;
  @Input() properties: TModel
  errors: string[] = [];
  id: number | string;
  isProcessing = false;

  constructor(private options: {
    api: IApi<TModel>,
    properties?: TModel,
    watch?: number,
    fields?: {
      id: 'id' | string
    }
  } | DetailOptions<TModel>) {
    options.fields = options.fields || { id: 'id' };

    if (options.properties) {
      this.originalModel = JSON.parse(JSON.stringify(options.properties));
      this.setModel(options.properties);
    }
  }

  private setModel(model: TModel): void {
    this.properties = model;
    this.id = this.options.fields ? model[this.options.fields.id] : model['id'];
    if (this.errors) {
      this.errors.splice(0, this.errors.length);
    }
  };

  get(id: string | number): Promise<TModel> {
    this.isProcessing = true;

    const options: any = {}

    if (!(this.options instanceof DetailOptions) && this.options.watch) {
      options.watch = this.options.watch
    }

    return this.options.api.get(id).then(data => {
      this.setModel(data);
      this.isProcessing = false;
      return data;
    }).catch(err => {
      this.isProcessing = false;
      throw err;
    });
  };

  fetch(id: string | number): Promise<TModel> {
    return this.get(id);
  }

  set(data: TModel) {
    this.setModel(data);
  };

  refresh(): Promise<TModel> {
    return this.get(this.id);
  };

  clear() {
    this.setModel(JSON.parse(JSON.stringify(this.options.properties)));
  };

  reset() {
    this.setModel(this.originalModel);
  };

  create(model?: TModel): Promise<TModel> {
    this.isProcessing = true;
    return this.options.api.create(this.properties).then(data => {
      this.setModel(data);
      this.isProcessing = false;
      return data;
    }).catch(err => {
      this.isProcessing = false;
      throw err;
    });
  };

  save(): Promise<TModel> {
    this.isProcessing = true;
    const id = this.properties[this.options.fields.id];

    if (!id) {
      return this.create();
    }
    return this.options.api.update(id, this.properties).then(data => {
      this.setModel(data);
      this.isProcessing = false;
      return data;
    }).catch(err => {
      this.isProcessing = false;
      throw err;
    });
  };

  remove(): Promise<void> {
    this.isProcessing = true;
    return this.options.api.remove(this.id).then(() => {
      this.isProcessing = false;
      return;
    }).catch((err) => {
      this.isProcessing = false;
      throw err;
    });
  };
};
