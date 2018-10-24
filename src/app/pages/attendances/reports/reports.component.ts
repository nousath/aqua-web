import { Component, OnInit } from '@angular/core';
import { AmsReportRequestService } from '../../../services';
import { ReportRequest } from '../../../models/report-request';
import { Page } from '../../../common/contracts/page';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common'
import { ToastyService } from 'ng2-toasty';
import { ReportType } from '../../../models';


@Component({
  selector: 'aqua-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  showFilters = false;
  fields: string[] = [];
  reportTypes: ReportType[] = [];

  reports: Page<ReportRequest>;

  selectedType: String;
  selected: ReportType;

  isCreating = false;

  filterFields = [
    'month',
    'name',
    'code',
    'designations',
    'departments',
    'supervisor',
    'userTypes',
    'contractors'
  ]

  constructor(
    private activatedRoute: ActivatedRoute,
    private toastyService: ToastyService,
    private amsReportRequest: AmsReportRequestService,
    location: Location,
  ) {

    this.reportTypes = amsReportRequest.reportTypes;

    this.reports = new Page({
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

    this.activatedRoute.queryParams.subscribe(query => {
      this.onSelection(query['type'])
    });
  }

  ngOnInit() {
    this.getReportLists()
  }

  onSelection(type) {
    if (!type) {
      this.filterFields = [];
      this.showFilters = false;
      return;
    }
    this.selected = this.reportTypes.find(item => item.type === type)

    switch (this.selected.type) {
      case 'daily-attendance':
        this.filterFields = [
          'date',
          'name',
          'code',
          'designations',
          'departments',
          'userTypes',
          'contractors',
          'supervisor',

          'shiftTypes',
          'attendanceStates',

          'clocked',
          'checkIn',
          'checkOut',
        ];
        break;
      case 'monthly-attendance':
        this.filterFields = [
          'month',
          'name',
          'code',
          'designations',
          'departments',
          'supervisor',
          'userTypes',
          'contractors'
        ];
        break;

    }

    this.showFilters = true;
    this.getReportLists();

  }

  getReportLists() {
    this.reports.filters.properties['type'] = this.selected ? this.selected.type : null;
    if (this.selected) {
      this.reports.fetch().catch(err => this.toastyService.error({ title: 'Error', msg: err }));
    }
  }

  reset() {

  }
  createReport(result) {

    const reportRequest = new ReportRequest();

    reportRequest.type = this.selected.type;
    reportRequest.provider = this.selected.provider;
    reportRequest.name = this.selected.name;

    reportRequest.reportParams = result.params;
    this.isCreating = true;
    this.amsReportRequest.reportRequests
      .create(reportRequest)
      .then(response => {
        this.isCreating = false;
        this.getReportLists();
      })
      .catch(err => {
        this.isCreating = false;
      });
  }
}
