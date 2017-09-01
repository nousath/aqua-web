import { TestBed, inject } from '@angular/core/testing';

import { AmsAlertService } from './ams-alert.service';

describe('AmsAlertService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AmsAlertService]
    });
  });

  it('should be created', inject([AmsAlertService], (service: AmsAlertService) => {
    expect(service).toBeTruthy();
  }));
});
