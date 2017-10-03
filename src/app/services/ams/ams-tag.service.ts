import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { IApi } from '../../common/contracts/api/api.interface';
import { GenericApi } from '../../common/generic-api';
import { Tag, TagType } from '../../models/tag';

@Injectable()
export class AmsTagService {

  tags: IApi<Tag>;
  tagTypes: IApi<TagType>;

  constructor(private http: Http) {

    const baseApi = 'ams';

    this.tags = new GenericApi<Tag>('tags', http, baseApi);
    this.tagTypes = new GenericApi<TagType>('tagTypes', http, baseApi);

  }

}
