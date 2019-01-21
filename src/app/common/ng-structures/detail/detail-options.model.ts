import { IApi } from '../../ng-api';


export class DetailOptions<TModel> {
  api: IApi<TModel>;
  properties: TModel;
  fields?= {
    id: 'id'
  };

  constructor(obj?: any) {
    if (!obj) { return; }
    if (obj.api) { this.api = obj.api; }
    if (obj.properties) { this.properties = obj.properties; }
    if (obj.fields) { this.fields = obj.fields; }
  }
}
