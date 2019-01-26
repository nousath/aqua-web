import { Component, OnInit, Input } from '@angular/core';
import { Attendance } from '../../../models/daily-attendance';

@Component({
  selector: 'aqua-check-in',
  templateUrl: './check-in.component.html',
  styleUrls: ['./check-in.component.css']
})
export class CheckInComponent implements OnInit {
  @Input()
  attendance: Attendance

  constructor() { }

  ngOnInit() {
  }

}
