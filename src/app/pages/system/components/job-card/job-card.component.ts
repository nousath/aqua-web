import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Job } from '../../../../models/job.model';
import { OuterSubscriber } from 'rxjs/OuterSubscriber';
import { Task } from '../../../../models/task.model';
import { AmsSystemUsageService } from '../../../../services';

@Component({
  selector: 'aqua-job-card',
  templateUrl: './job-card.component.html',
  styleUrls: ['./job-card.component.css']
})
export class JobCardComponent implements OnInit {

  @Input()
  job: Job;

  @Output()
  created: EventEmitter<Task> = new EventEmitter();

  isProcessing = false;
  action: string;
  date: Date;

  constructor(
    private systemService: AmsSystemUsageService
  ) { }

  run() {
    this.isProcessing = true;
    this.systemService.tasks.create({
      assignedTo: this.job.type,
      entity: this.job.code,
      action: this.action,
      data: this.date,
    }).then((task) => {
      this.isProcessing = false;
      this.created.emit(task)
    }).catch(err => {
      this.isProcessing = false;
    });
  }

  ngOnInit() {
  }

}
