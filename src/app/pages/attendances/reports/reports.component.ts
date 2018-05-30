import { Component, OnInit } from "@angular/core";
import { AmsReportRequestService } from "../../../services";
import { ReportRequest } from "../../../models/report-request";
import { Page } from "../../../common/contracts/page";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { Location } from '@angular/common'
import { ToastyService } from 'ng2-toasty';
@Component({
  selector: "aqua-reports",
  templateUrl: "./reports.component.html",
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  reportTypes = [{
    type: 'daily-attendance',
    name: 'Daily Attendance'
  }, {
    type: 'monthly-attendance',
    name: 'Monthly Attendance (summary)'
  }, {
    type: 'attendance-details',
    name: 'Monthly Attendance (detailed)'
  }, {
    type: 'form-25',
    name: 'Form 25'
  }, {
    type: 'daily-extra-hours-after-shift-end',
    name: 'Daily Extra Hours (after shift)'
  }, {
    type: 'daily-extra-hours-after-shift-hours',
    name: 'Daily Extra Hours (net)'
  }, {
    type: 'monthly-extra-hours-after-shift-end',
    name: 'Monthly Extra Hours (after shift)'
  }, {
    type: 'monthly-extra-hours-after-shift-hours',
    name: 'Monthly Extra Hours (net)'
  }, {
    type: 'monthly-late-check-in',
    name: 'Late Check-in (monthly)'
  }, {
    type: 'monthly-early-check-out',
    name: 'Early Check-out (monthly)'
  }, {
    type: 'employees-details',
    name: 'Employee Details'
  }];

  reports: Page<ReportRequest>;
  subscription: Subscription;

  constructor(
    private amsReportRequestService: AmsReportRequestService,
    private activatedRoute: ActivatedRoute,
    private toastyService: ToastyService,
    private location: Location,
  ) {


    this.reports = new Page({
      api: amsReportRequestService.reportRequests,
      location: location,
      filters: [
        {
          field: 'type',
          value: this.activatedRoute.queryParams['value']['type']
        }
      ]
    });

    this.subscription = this.activatedRoute.queryParams.subscribe(query => {
      this.reports.filters.properties['type']['value'] = query['type'] || '';
    });
  }

  ngOnInit() {
    this.getReportLists()
  }

  getReportLists() {
    this.reports.filters.properties['type']['value']
    this.reports.fetch().catch(err => this.toastyService.error({ title: 'Error', msg: err }));
  }
}
