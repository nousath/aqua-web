import { TestBed, inject } from '@angular/core/testing';

import { AmsEffectiveShiftService } from './ams-effective-shift.service';

describe('AmsEffectiveShiftService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AmsEffectiveShiftService]
    });
  });

  it('should be created', inject([AmsEffectiveShiftService], (service: AmsEffectiveShiftService) => {
    expect(service).toBeTruthy();
  }));
});
