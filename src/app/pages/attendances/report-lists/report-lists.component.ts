import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AmsReportRequestService } from '../../../services';
import { ReportRequest } from '../../../models/report-request';
import { PagerModel } from '../../../common/ng-structures';

@Component({
  selector: 'aqua-report-lists',
  templateUrl: './report-lists.component.html',
  styleUrls: ['./report-lists.component.css']
})
export class ReportListsComponent implements OnInit {


  @Input() reportRequests: PagerModel<ReportRequest>

  @Output()
  refresh: EventEmitter<String> = new EventEmitter<String>();

  constructor(private amsReportRequestService: AmsReportRequestService) {

  }

  ngOnInit() {
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
