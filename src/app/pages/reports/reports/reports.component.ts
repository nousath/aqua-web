import { Component, OnInit } from '@angular/core';
import { AmsReportRequestService } from '../../../services';
import { ReportRequest } from '../../../models/report-request';
import { PagerModel } from '../../../common/ng-structures';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ToastyService } from 'ng2-toasty';
import { ReportType } from '../../../models';


@Component({
  selector: 'aqua-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  area: string;
  code: string;

  reportTypes: ReportType[] = [];
  selected: ReportType;

  filters: any;

  isCreating = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private toastyService: ToastyService,
    private amsReportRequest: AmsReportRequestService,
  ) {

    // this.reportTypes = amsReportRequest.reportTypes;
    this.code = this.activatedRoute.snapshot.params['code']
    this.area = this.activatedRoute.snapshot.params['area']
    this.fetchReportType();
    this.activatedRoute.params.subscribe(params => {
      this.area = params['area']
      this.code = params['code']
      this.fetchReportType();
    });
  }

  fetchReportType() {
    this.amsReportRequest.getByArea(this.area).subscribe(items => {
      this.reportTypes = items
      if (this.code) {
        this.selected = this.reportTypes.find(item => item.code.toLowerCase() === this.code.toLowerCase())
      }
    });
  }

  ngOnInit() {
  }

  build(result) {
    const reportRequest = new ReportRequest();
    reportRequest.type = this.selected.type;
    reportRequest.provider = this.selected.provider;
    reportRequest.name = this.selected.name;
    reportRequest.reportParams = result.params;
    this.isCreating = true;
    this.amsReportRequest.reportRequests
      .create(reportRequest)
      .then(response => {
        this.filters = result.params
        this.isCreating = false;
      })
      .catch(err => {
        this.isCreating = false;
        this.toastyService.error({ title: 'Error', msg: err })
      });
  }

  reset() {
    this.filters = null;
  }

  backClicked() {
    this.location.back();
  }

}
