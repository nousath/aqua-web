import { Injectable } from '@angular/core';
import { IApi } from '../../common/contracts/api/api.interface';
import { GenericApi } from '../../common/generic-api';
import { Http } from '@angular/http';
import { Department } from '../../models/department';

@Injectable()
export class EmsDepartmentService {

  departments: IApi<Department>;

  constructor(private http: Http) {
    const baseApi = 'ems';

    this.departments = new GenericApi<Department>('departments', http, baseApi);
  }

}
