import { TestBed, inject } from '@angular/core/testing';

import { AmsAttendanceService } from './ams-attendance.service';

describe('AmsAttendanceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AmsAttendanceService]
    });
  });

  it('should be created', inject([AmsAttendanceService], (service: AmsAttendanceService) => {
    expect(service).toBeTruthy();
  }));
});
