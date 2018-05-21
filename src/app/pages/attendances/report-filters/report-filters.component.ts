import { Component, OnInit, Input } from "@angular/core";
import { AmsReportRequestService } from "../../../services/ams/ams-report-request.service";
import { ReportRequest } from "../../../models/report-request";

@Component({
  selector: "aqua-report-filters",
  templateUrl: "./report-filters.component.html",
  styleUrls: ["./report-filters.component.css"]
})
export class ReportFiltersComponent implements OnInit {
  reportRequest: ReportRequest = new ReportRequest();

  @Input() type: string;
  isLoading: boolean = false;

  constructor(private amsReportRequest: AmsReportRequestService) {}

  ngOnInit() {}

  ngOnChanges() {
    if (this.type) {
      this.reportRequest.type = this.type;
    }
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
