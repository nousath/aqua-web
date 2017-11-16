import { TestBed, inject } from '@angular/core/testing';

import { AmsSystemUsageService } from './ams-system-usage.service';

describe('AmsSystemUsageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AmsSystemUsageService]
    });
  });

  it('should be created', inject([AmsSystemUsageService], (service: AmsSystemUsageService) => {
    expect(service).toBeTruthy();
  }));
});
