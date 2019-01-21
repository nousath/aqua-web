import { Location } from '@angular/common';
import { IPager } from './pager.interface';
import { PagerOptions } from './pager-options.model';
import { Filters } from '../filter/index';
import { finalize, map } from 'rxjs/operators'
import { PageOptions, Page } from '../../ng-api';


export class PagerBaseComponent<TModel> implements IPager {

  errors: string[] = [];
  filters: Filters;
  isLoading = false;
  isGettingStats = false;

  pageNo = 1;
  totalPages = 0;
  pageSize: number;


  totalRecords: number;
  items: Array<TModel>;
  stats: any;


  constructor(public options: PagerOptions<TModel>) {
    this.items = [];
    if (!options.pageOptions) {
      options.pageOptions = new PageOptions();
    }
    this.filters = new Filters({
      associatedList: this,
      filters: options.filters,
      location: options.location
    });
  }

  private convertToPageOption(pageNo: number) {
    const options = new PageOptions()
    options.offset = (pageNo - 1) * this.options.pageOptions.limit;
    options.limit = this.options.pageOptions.limit;
    return options;
  }

  fetch(options?: PageOptions): Promise<Page<TModel>> {
    this.isLoading = true;
    if (!options) {
      options = new PageOptions()
      if (!this.options.pageOptions.noPaging) {
        options.set({
          offset: (this.pageNo - 1) * this.options.pageOptions.limit,
          limit: this.options.pageOptions.limit
        })
      }
    }

    options.query = this.filters.getQuery();

    return this.options.api.search(options).then(page => {
      this.isLoading = false;
      const items: TModel[] = [];
      page.stats = page.stats || {};
      page.items.forEach((item) => {
        items.push(item);
      });

      this.items = items;
      this.totalRecords = page.total || page.stats.total || this.items.length;
      this.pageSize = page.pageSize;
      this.pageNo = page.pageNo;

      this.totalPages = Math.ceil(this.totalRecords / this.options.pageOptions.limit);
      return page;
    }).catch((err) => {

      this.isLoading = false;
      throw err;
    });
  }

  add(param: TModel) {
    this.items.push(param);
    return this;
  };

  remove(item: TModel): void {
    const id = item[this.options.fields.id];
    let found = false;
    if (this.items && this.items.length) {
      let i = this.items.length;
      while (i--) {
        if (this.items[i] && this.items[i][this.options.fields.id] === id) {
          this.items.splice(i, 1);
          found = true;
          break;
        }
      }
    }

    if (found) {
      this.totalRecords = this.totalRecords - 1;
    }
  }

  clear() {
    this.totalRecords = 0;
    this.items = [];
  };

  pages(): number[] {
    const maxPages = this.options.maxPagesToShow;
    let index: number;

    const pageNos: number[] = [];

    let firstPage = 1;

    let lastPage = this.totalPages;

    if (this.totalPages > this.options.maxPagesToShow) {
      if (this.pageNo < this.options.maxPagesToShow) {
        lastPage = this.options.maxPagesToShow;
      } else if (this.pageNo > (this.totalPages - this.options.maxPagesToShow)) {
        firstPage = this.totalPages - this.options.maxPagesToShow;
      } else {
        firstPage = this.pageNo - this.options.maxPagesToShow / 2;
        if (firstPage < 1) { firstPage = 1; }
        lastPage = this.pageNo + this.options.maxPagesToShow / 2;
        if (lastPage > this.totalPages) { lastPage = this.totalPages; }
      }
    }

    if (firstPage !== 1) {
      pageNos.push(-2);
    }

    for (index = firstPage; index <= lastPage; index++) {
      pageNos.push(index);
    }

    if (pageNos.length === 0) {
      pageNos.push(1);
    }

    if (firstPage !== this.totalPages) {
      pageNos.push(-1);
    }

    return pageNos;
  };

  showPage(pageNo: number) {
    if (this.isLoading) {
      return;
    }
    if (pageNo === -2) {
      pageNo = 1;
      return;
    }

    if (pageNo === -1) {
      pageNo = this.totalPages;
      return;
    }

    return this.fetch(this.convertToPageOption(pageNo));
  }

  showPrevious() {
    if (this.isLoading || this.pageNo <= 1) {
      return;
    }
    this.showPage(this.pageNo - 1);
  };

  showNext() {
    if (this.isLoading || this.totalPages <= this.pageNo) {
      return;
    }
    this.showPage(this.pageNo + 1);
  };
}

