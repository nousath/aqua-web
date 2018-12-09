import { TestBed, inject } from '@angular/core/testing';

import { UxService } from './ux.service';

describe('UxService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UxService]
    });
  });

  it('should be created', inject([UxService], (service: UxService) => {
    expect(service).toBeTruthy();
  }));
});
