import { PagerBaseComponent } from './pager-base.component';
import { PagerOptions } from './pager-options.model';

export class PagerModel<TModel> extends PagerBaseComponent<TModel>  {
  constructor(options: PagerOptions<TModel>) {
    super(options);
  }
}
