import { Component, OnInit, Input } from '@angular/core';
import { Attendance } from '../../../models';
import { DatesService } from '../../services/dates.service';

@Component({
  selector: 'aqua-check-out',
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.css']
})
export class CheckOutComponent implements OnInit {

  @Input()
  attendance: Attendance

  isPast = false;
  early: string;
  overTime: string;

  constructor(
    private datesService: DatesService
  ) { }

  ngOnInit() {
    this.isPast = this.datesService.date(this.attendance.ofDate).isPast()
    if (this.attendance.early) {
      this.early = this.datesService.time(this.attendance.early).span();
    }

    if (this.attendance.overTime) {
      this.overTime = this.datesService.time(this.attendance.overTime).span();
    }
  }

}
