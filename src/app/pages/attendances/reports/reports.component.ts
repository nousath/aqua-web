import { Component, OnInit } from '@angular/core';
import { AmsReportRequestService } from '../../../services';
import { ReportRequest } from '../../../models/report-request';
import { Page } from '../../../common/contracts/page';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common'
import { ToastyService } from 'ng2-toasty';

class ReportType {
  type: String;
  name: String
  provider: String
}
@Component({
  selector: 'aqua-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  reportTypes: ReportType[] = [{
    type: 'daily-attendance',
    name: 'Daily Attendance',
    provider: 'ams'
  }, {
    type: 'monthly-attendance',
    name: 'Monthly Attendance (summary)',
    provider: 'ams'
  }, {
    type: 'attendance-details',
    name: 'Monthly Attendance (detailed)',
    provider: 'ams'
  }, {
    type: 'form-25',
    name: 'Form 25',
    provider: 'ams'
  }, {
    type: 'daily-extra-hours-after-shift-end',
    name: 'Daily Extra Hours (after shift)',
    provider: 'ams'
  }, {
    type: 'daily-extra-hours-after-shift-hours',
    name: 'Daily Extra Hours (net)',
    provider: 'ams'
  }, {
    type: 'monthly-extra-hours-after-shift-end',
    name: 'Monthly Extra Hours (after shift)',
    provider: 'ams'
  }, {
    type: 'monthly-extra-hours-after-shift-hours',
    name: 'Monthly Extra Hours (net)',
    provider: 'ams'
  }, {
    type: 'monthly-late-check-in',
    name: 'Late Check-in (monthly)',
    provider: 'ams'
  }, {
    type: 'monthly-early-check-out',
    name: 'Early Check-out (monthly)',
    provider: 'ams'
  }, {
    type: 'employees-details',
    name: 'Employee Details',
    provider: 'ems'
  }];

  reports: Page<ReportRequest>;

  selectedType: String;
  selected: ReportType;

  constructor(
    private activatedRoute: ActivatedRoute,
    private toastyService: ToastyService,
    amsReportRequestService: AmsReportRequestService,
    location: Location,
  ) {

    this.reports = new Page({
      api: amsReportRequestService.reportRequests,
      location: location,
      filters: [{
        field: 'type',
        value: this.activatedRoute.queryParams['value']['type']
      }, {
        field: 'provider',
        value: this.activatedRoute.queryParams['value']['provider']
      }]
    });

    this.activatedRoute.queryParams.subscribe(query => {
      if (query['type']) {
        this.selected = this.reportTypes.find(item => item.type === query['type'])
        this.selectedType = this.selected.type;
      } else {
        this.selected = null;
        this.selectedType = null;
      }
    });
  }

  ngOnInit() {
    this.getReportLists()
  }

  onSelection() {
    this.selected = this.reportTypes.find(item => item.type === this.selectedType)
    this.getReportLists();
  }

  getReportLists() {
    this.reports.filters.properties['type']['value'] = this.selected ? this.selected.type : null;
    if (this.selected) {
      this.reports.fetch().catch(err => this.toastyService.error({ title: 'Error', msg: err }));
    }
  }
}
