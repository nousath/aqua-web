import { Component, OnInit } from '@angular/core';
import { Employee } from '../../../../models';
import { EmsAuthService } from '../../../../services/ems/ems-auth.service';

@Component({
  selector: 'aqua-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {

  employee: Employee;
  constructor(private auth: EmsAuthService) { }

  ngOnInit() {
    this.employee = this.auth.getCurrentUser();
  }

}
