import { Location } from '@angular/common';
import { IApi, PageOptions } from '../../ng-api';

export class PagerOptions<TModel> {

  api: IApi<TModel>;
  properties?: TModel;
  fields?: {
    id: 'id',
    timeStamp: 'timeStamp'
  };

  pageOptions?: PageOptions;
  maxPagesToShow?= 10;
  filters?: any[] = [];
  location?: Location;

  constructor(obj?: any) {
    if (!obj) { return; }
    if (obj.api) { this.api = obj.api; }
    if (obj.maxPagesToShow) { this.maxPagesToShow = obj.maxPagesToShow; }
    if (obj.location) { this.location = obj.location; }
    if (obj.fields) { this.fields = obj.fields; }
    if (obj.pageOptions) { this.pageOptions = new PageOptions(obj.pageOptions); }

    if (obj.filters) {
      obj.filters.forEach(element => {
        this.filters.push(element);
      });
    }
  }
}
