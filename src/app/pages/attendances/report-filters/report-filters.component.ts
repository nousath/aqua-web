import { Component, OnInit, Input } from '@angular/core';
import { AmsReportRequestService } from '../../../services/ams/ams-report-request.service';
import { ReportRequest } from '../../../models/report-request';
import { Observable } from 'rxjs/Observable';
import { Employee } from '../../../models';
import { AutoCompleteService } from '../../../services';
import { AmsTagService } from '../../../services/ams/ams-tag.service';
import { Page } from '../../../common/contracts/page';
import { TagType } from '../../../models/tag';
import { ToastyService } from 'ng2-toasty';
import { Tags } from '../../../shared/components/employees-filter/employees-filter.component';

@Component({
  selector: 'aqua-report-filters',
  templateUrl: './report-filters.component.html',
  styleUrls: ['./report-filters.component.css']
})
export class ReportFiltersComponent implements OnInit {
  reportRequest: ReportRequest = new ReportRequest();
  tagTypes: Page<TagType>;
  tags: Tags = new Tags();

  employee: Employee;
  supervisor: Employee;


  @Input() type: string;
  @Input()
  reportTypes: [{
    type: string,
    name: string
  }];
  isLoading = false;

  constructor(private amsReportRequest: AmsReportRequestService,
    private autoCompleteService: AutoCompleteService,
    private toastyService: ToastyService,
    private tagService: AmsTagService) {
    this.tagTypes = new Page({
      api: tagService.tagTypes
    });

    this.tagTypes.fetch().catch(err => this.toastyService.error({ title: 'Error', msg: err }));
  }

  ngOnInit() { }

  ngOnChanges() {
    if (this.type) {
      this.reportRequest.type = this.type;
    }
    if (this.reportTypes) {
      const reportType = this.reportTypes.find(item => item.type === this.type);
      if (reportType) {
        this.reportRequest.reportParams.reportName = reportType.name;
      }
    }
  }


  onSelectEmp(emp: Employee) {
    this.reportRequest.reportParams.name = emp.name;
    this.reportRequest.reportParams.code = emp.code;
  }

  onSelectSup(emp: Employee) {
    this.reportRequest.reportParams.supervisor = emp.id;
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
    const tags: string[] = [];
    this.tags.selected.forEach((tag: any) => {
      tags.push(tag.tagId)
    })
    this.reportRequest.reportParams.tagIds = tags;
    this.isLoading = true;
    this.amsReportRequest.reportRequests
      .create(this.reportRequest)
      .then(response => {
        this.isLoading = false;
        this.tags.reset()
      })
      .catch(err => {
        this.isLoading = false;
        this.tags.reset()
      });
  }
}
