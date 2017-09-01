import { TestBed, inject } from '@angular/core/testing';

import { EmsDesignationService } from './ems-designation.service';

describe('EmsDesignationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmsDesignationService]
    });
  });

  it('should be created', inject([EmsDesignationService], (service: EmsDesignationService) => {
    expect(service).toBeTruthy();
  }));
});
