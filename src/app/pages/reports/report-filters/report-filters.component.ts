import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { AmsReportRequestService } from '../../../services/ams/ams-report-request.service';
import { ReportRequest } from '../../../models/report-request';
import { Observable } from 'rxjs/Observable';
import { Employee } from '../../../models';
import { AutoCompleteService } from '../../../services';
import { PagerModel } from '../../../common/ng-structures';
import { ToastyService } from 'ng2-toasty';

@Component({
  selector: 'aqua-report-filters',
  templateUrl: './report-filters.component.html',
  styleUrls: ['./report-filters.component.css']
})
export class ReportFiltersComponent implements OnInit, OnChanges {
  reportRequest: ReportRequest = new ReportRequest();

  employee: Employee;
  supervisor: Employee;

  @Input()
  type: string;

  @Input()
  provider: string;

  @Output()
  submitted: EventEmitter<ReportRequest> = new EventEmitter();

  @Input()
  reportTypes: [{
    type: string,
    provider: string,
    name: string
  }];

  isLoading = false;

  show = {
    monthPicker: true,
    datePicker: true,
    employeeFilters: true
  };

  constructor(private amsReportRequest: AmsReportRequestService,
    private autoCompleteService: AutoCompleteService,
    private toastyService: ToastyService) {
  }

  ngOnInit() { }
  ngOnChanges() {
    if (this.type) {
      this.reportRequest.type = this.type;
    }

    if (this.provider) {
      this.reportRequest.provider = this.provider;
    }

    if (this.reportTypes) {
      const reportType = this.reportTypes.find(item => item.type === this.type);
      if (reportType) {
        this.reportRequest.reportParams.reportName = reportType.name;
      }
    }

    switch (this.type) {
      case 'monthly-extra-hours-after-shift-end':
      case 'monthly-extra-hours-after-shift-hours':
      case 'monthly-early-check-out':
      case 'monthly-late-check-in':
      case 'monthly-attendance':
      case 'attendance-details':
      case 'form-25':
        this.show.monthPicker = true;
        this.show.datePicker = false;
        this.show.employeeFilters = true;
        break;
      case 'daily-extra-hours-after-shift-end':
      case 'daily-extra-hours-after-shift-hours':
      case 'daily-attendance':
        this.show.monthPicker = false;
        this.show.datePicker = true;
        this.show.employeeFilters = true;
        break;
      case 'shift-details':
      case 'employees-details':
        this.show.monthPicker = false;
        this.show.datePicker = false;
        this.show.employeeFilters = true;
        break;
    }
  }

  onSelectEmp(emp: Employee) {
    this.reportRequest.reportParams.name = emp.name;
    this.reportRequest.reportParams.code = emp.code;
  }

  onSelectSup(emp: Employee) {
    this.reportRequest.reportParams.supervisor = emp.id;
    this.reportRequest.reportParams.supervisorName = emp.name;
  }

  empSource(keyword: string): Observable<Employee[]> {
    return this.autoCompleteService.searchByKey<Employee>('name', keyword, 'ams', 'employees');
  }

  empFormatter(data: Employee): string {
    return data.name;
  }

  empListFormatter(data: Employee): string {
    return `${data.name} (${data.code})`;
  }

  onSubmit() {
  }
}
