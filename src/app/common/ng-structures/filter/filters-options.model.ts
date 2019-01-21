import { Location } from '@angular/common';
import { IPager } from '../pager/index';


export class FiltersOptions {
    associatedList: IPager;
    location?: Location;
    filters: any[];
}
