import { Component, OnInit } from '@angular/core';
import { AmsSystemUsageService } from '../../../services/ams/ams-system-usage.service';
import { Job } from '../../../models/job.model';
import { Router } from '@angular/router';

@Component({
  selector: 'aqua-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css']
})
export class JobsComponent implements OnInit {

  jobs: Job[] = [];

  constructor(
    private router: Router,
    private systemService: AmsSystemUsageService

  ) {
    systemService.getJobs().subscribe(items => {
      this.jobs = items
    });
  }



  ngOnInit() {
  }

}
