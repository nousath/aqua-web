import { Component, OnInit } from '@angular/core';
import { AmsReportRequestService } from '../../../services';
import { ReportRequest } from '../../../models/report-request';
import { Page } from '../../../common/contracts/page';

@Component({
  selector: 'aqua-report-lists',
  templateUrl: './report-lists.component.html',
  styleUrls: ['./report-lists.component.css']
})
export class ReportListsComponent implements OnInit {

  reportRequests: Page<ReportRequest>

  constructor(private amsReportRequestService: AmsReportRequestService) {

    this.reportRequests = new Page({
      api: amsReportRequestService.reportRequests
    });
    
   }

  ngOnInit() {
    this.getReportLists()
  }

  getReportLists(){
    this.reportRequests.fetch()
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
