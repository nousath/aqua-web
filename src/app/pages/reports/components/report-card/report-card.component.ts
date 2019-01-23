import { Component, OnInit, Input } from '@angular/core';
import { ReportType } from '../../../../models';

@Component({
  selector: 'aqua-report-card',
  templateUrl: './report-card.component.html',
  styleUrls: ['./report-card.component.css']
})
export class ReportCardComponent implements OnInit {

  @Input()
  type: ReportType;

  constructor() { }

  ngOnInit() {
  }

}
