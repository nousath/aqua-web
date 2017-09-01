import { TestBed, inject } from '@angular/core/testing';

import { AmsHolidayService } from './ams-holiday.service';

describe('AmsHolidayService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AmsHolidayService]
    });
  });

  it('should be created', inject([AmsHolidayService], (service: AmsHolidayService) => {
    expect(service).toBeTruthy();
  }));
});
