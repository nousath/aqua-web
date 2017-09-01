import { TestBed, inject } from '@angular/core/testing';

import { AmsShiftService } from './ams-shift.service';

describe('AmsShiftService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AmsShiftService]
    });
  });

  it('should be created', inject([AmsShiftService], (service: AmsShiftService) => {
    expect(service).toBeTruthy();
  }));
});
