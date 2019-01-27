import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { IApi } from '../../common/ng-api/api.interface';
import { GenericApi } from '../../common/ng-api/generic-api';
import { System } from '../../models/system';
import { Task } from '../../models/task.model';

@Injectable()
export class AmsSystemUsageService {

  systems: IApi<System>;
  tasks: IApi<Task>;

  constructor(private http: Http) {
    const baseApi = 'ams';

    this.systems = new GenericApi<System>('systems/usage', http, baseApi);
    this.tasks = new GenericApi<Task>('tasks', http, baseApi);
  }

}
