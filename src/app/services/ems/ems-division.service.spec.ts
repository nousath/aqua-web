import { TestBed, inject } from '@angular/core/testing';

import { EmsDivisionService } from './ems-division.service';

describe('EmsContractorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmsDivisionService]
    });
  });

  it('should be created', inject([EmsDivisionService], (service: EmsDivisionService) => {
    expect(service).toBeTruthy();
  }));
});
