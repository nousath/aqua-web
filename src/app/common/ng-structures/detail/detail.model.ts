import { DetailBase } from './detail-base.component';
import { DetailOptions } from '.';
export class DetailModel<TModel> extends DetailBase<TModel> {
  constructor(options: DetailOptions<TModel>) {
    super(options);
  }
}
