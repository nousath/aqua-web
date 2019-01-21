import { PageOptions } from '../../ng-api';

export interface IPager {
  fetch(options?: PageOptions): any;
}
