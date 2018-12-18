import { TestBed, inject } from '@angular/core/testing';

import { EmsContractorService } from './ems-contractor.service';

describe('EmsContractorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmsContractorService]
    });
  });

  it('should be created', inject([EmsContractorService], (service: EmsContractorService) => {
    expect(service).toBeTruthy();
  }));
});
