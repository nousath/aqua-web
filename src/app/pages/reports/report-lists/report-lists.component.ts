import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { AmsReportRequestService } from '../../../services';
import { ReportRequest } from '../../../models/report-request';
import { PagerModel } from '../../../common/ng-structures';
import { ReportType } from '../../../models';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ToastyService } from 'ng2-toasty';


@Component({
  selector: 'aqua-report-lists',
  templateUrl: './report-lists.component.html',
  styleUrls: ['./report-lists.component.css']
})
export class ReportListsComponent implements OnInit, OnChanges {


  @Input()
  reportType: ReportType;

  @Input()
  reportParams: any;

  @Output()
  refresh: EventEmitter<String> = new EventEmitter<String>();

  reportRequests: PagerModel<ReportRequest>;
  isCreating = false;

  constructor(
    private amsReportRequest: AmsReportRequestService,
    private activatedRoute: ActivatedRoute,
    private toastyService: ToastyService,
    location: Location,
  ) {

    this.reportRequests = new PagerModel({
      api: amsReportRequest.reportRequests,
      location: location,
      filters: [{
        field: 'type',
        value: this.activatedRoute.queryParams['value']['type']
      }, {
        field: 'provider',
        value: this.activatedRoute.queryParams['value']['provider']
      }]
    });

  }

  getReportLists() {
    this.reportRequests.filters.properties['type'].value = this.reportType.type;
    this.reportRequests.fetch().catch(err => this.toastyService.error({ title: 'Error', msg: err }));
  }
  ngOnInit() {
    this.getReportLists();
  }

  ngOnChanges() {
    this.getReportLists();
  }
  updateList() {
    this.refresh.emit()
  }

  download(url, reportType) {
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.href = url;
    a.download = reportType;
    a.click();
    document.body.removeChild(a);
  }

}
