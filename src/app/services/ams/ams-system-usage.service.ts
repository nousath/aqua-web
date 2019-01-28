import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { IApi } from '../../common/ng-api/api.interface';
import { GenericApi } from '../../common/ng-api/generic-api';
import { System } from '../../models/system';
import { Task } from '../../models/task.model';
import { Job } from '../../models/job.model';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class AmsSystemUsageService {

  systems: IApi<System>;
  tasks: IApi<Task>;
  jobs: IApi<Job>;

  jobList: Job[] = [
    { code: 'work-day', name: 'Work Day', actions: [{ code: 'start', name: 'Start' }, { code: 'regenerate', name: 'Regenerate' }], type: 'processor', icon: 'daily.svg' },
    { code: 'work-month', name: 'Work Month', actions: [{ code: 'start', name: 'Start' }, { code: 'end', name: 'End' }], type: 'processor', icon: 'daily.svg' },
    { code: 'work-day', name: 'Work Day Job', actions: [], type: 'job', icon: 'daily.svg' },

  ]


  constructor(private http: Http) {
    const baseApi = 'ams';

    this.systems = new GenericApi<System>('systems/usage', http, baseApi);
    this.tasks = new GenericApi<Task>('tasks', http, baseApi);
    this.jobs = new GenericApi<Job>('jobs', http, baseApi);
  }


  getJobs(): Observable<Job[]> {
    const subject: Subject<Job[]> = new Subject();
    setTimeout(() => {
      subject.next(this.jobList);
    }, 1);
    return subject.asObservable();
  }

}
