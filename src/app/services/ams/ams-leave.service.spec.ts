import { TestBed, inject } from '@angular/core/testing';

import { AmsLeaveService } from './ams-leave.service';

describe('AmsLeaveService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AmsLeaveService]
    });
  });

  it('should be created', inject([AmsLeaveService], (service: AmsLeaveService) => {
    expect(service).toBeTruthy();
  }));
});
