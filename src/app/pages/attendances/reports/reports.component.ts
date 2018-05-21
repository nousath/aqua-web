import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'aqua-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  reportTypes = [
    'daily-extra-hours-after-shift-end',
    'daily-extra-hours-after-shift-hours',
    'daily-attendance',
    'monthly-extra-hours-after-shift-end',
    'monthly-extra-hours-after-shift-hours',
    'monthly-attendance',
  ]

  selectedType: string;

  constructor() { }

  ngOnInit() {
  }

}
