import { Component, OnInit, Input } from "@angular/core";
import { AmsReportRequestService } from "../../../services/ams/ams-report-request.service";
import { ReportRequest } from "../../../models/report-request";
import { Observable } from "rxjs/Observable";
import { Employee } from "../../../models";
import { AutoCompleteService } from "../../../services";

@Component({
  selector: "aqua-report-filters",
  templateUrl: "./report-filters.component.html",
  styleUrls: ["./report-filters.component.css"]
})
export class ReportFiltersComponent implements OnInit {
  reportRequest: ReportRequest = new ReportRequest();

  @Input() type: string;

  @Input()
  reportTypes: [{
    type: string,
    name: string
  }];

  isLoading: boolean = false;
  employee: Employee;

  constructor(private amsReportRequest: AmsReportRequestService,
    private autoCompleteService: AutoCompleteService) { }

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
    // if (emp.id) {
    //   this.router.navigate(['pages/attendances/daily', emp.id]);
    //   this.selectedEmp = new Employee();
    // }
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
    this.isLoading = true;
    this.amsReportRequest.reportRequests
      .create(this.reportRequest)
      .then(response => {
        this.isLoading = false;
      })
      .catch(err => {
        this.isLoading = false;
      });
  }
}
