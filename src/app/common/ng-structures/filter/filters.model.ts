import { Location } from '@angular/common';
import { URLSearchParams } from '@angular/http';

import { Filter } from './filter.model';
import { FiltersOptions } from './filters-options.model';
import { IFilters } from './filters.interface';
import * as moment from 'moment';


export class Filters implements IFilters {

  items: Filter[] = [];
  properties = {};

  location: Location;

  constructor(private options: FiltersOptions) {
    if (options.filters) {
      options.filters.forEach(item => {
        const model = new Filter(item, this);
        this.items.push(model);
        this.properties[model.field] = model;
      });
    }
    this.location = options.location;
  }

  apply() {
    return this.options.associatedList.fetch();
  }

  reset() {
    this.items.forEach(item => {
      item.reset();
    });
    return this.apply();

  }

  get(field: string): Filter {
    return this.properties[field];
  }

  set(field: string, value: any) {
    const item = this.properties[field];
    item.value = value;
    return this.apply();
  }

  getQuery() {
    const query = {};

    const urlSearchParams = this.location ? (new URLSearchParams(this.location.path().split('?')[1])) : null;

    let count = 0;

    this.items.forEach(item => {
      if (urlSearchParams && !item.skipUrl) {
        const value = (item.value instanceof Date) ? moment(item.value).toJSON() : item.value;
        urlSearchParams.set(item.field, item.isEmpty() ? null : value);
      }

      if (item.value && item.value !== '' && item.value !== 0) {
        // params['f[' + count + '][f]'] = item.field;
        // params['f[' + count + '][o]'] = item.operator;
        // params['f[' + count + '][v]'] = item.value;
        query[item.field] = item.value;
        count++;
      }
    });

    if (urlSearchParams) {
      const url = this.location.path().split('?')[0];
      this.location.replaceState(url, urlSearchParams.toString());
    }

    return query;
  }
}
