import { Component, OnInit, Input } from '@angular/core';
import { Attendance } from '../../../models/daily-attendance';
import { DatesService } from '../../services';

@Component({
  selector: 'aqua-check-in',
  templateUrl: './check-in.component.html',
  styleUrls: ['./check-in.component.css']
})
export class CheckInComponent implements OnInit {
  @Input()
  attendance: Attendance

  late: string

  constructor(
    private dates: DatesService
  ) { }

  ngOnInit() {

    if (this.attendance.late) {
      this.late = this.dates.time(this.attendance.late).span();
    }
  }

}
