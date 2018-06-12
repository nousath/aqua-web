import { TestBed, inject } from '@angular/core/testing';

import { AmsReportRequestService } from './ams-report-request.service';

describe('AmsReportRequestService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AmsReportRequestService]
    });
  });

  it('should be created', inject([AmsReportRequestService], (service: AmsReportRequestService) => {
    expect(service).toBeTruthy();
  }));
});
