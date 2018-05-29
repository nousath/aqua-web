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
  styleUrls: ["./reports.component.css"]
})
export class ReportsComponent implements OnInit {
  reportTypes = [
    "daily-extra-hours-after-shift-end",
    "daily-extra-hours-after-shift-hours",
    "daily-attendance",
    "monthly-extra-hours-after-shift-end",
    "monthly-extra-hours-after-shift-hours",
    "monthly-attendance",
    "attendance-details",
    "monthly-late-check-in",
    "monthly-early-check-out",
    "form-25"
  ];

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
          field: "type",
          value: this.activatedRoute.queryParams["value"]["type"]
        }
      ]
    });

    this.subscription = this.activatedRoute.queryParams.subscribe(query => {
      this.reports.filters.properties["type"]["value"] = query["type"] || "";
    });
  }

  ngOnInit() {
    this.getReportLists()
  }

  getReportLists() {
    this.reports.filters.properties["type"]["value"]
    this.reports.fetch().catch(err => this.toastyService.error({ title: 'Error', msg: err }));
  }
}
