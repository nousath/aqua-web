import { TestBed, inject } from '@angular/core/testing';

import { EmsAuthService } from './ems-auth.service';

describe('EmsAuthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmsAuthService]
    });
  });

  it('should be created', inject([EmsAuthService], (service: EmsAuthService) => {
    expect(service).toBeTruthy();
  }));
});
