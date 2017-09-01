import { TestBed, inject } from '@angular/core/testing';

import { AutoCompleteService } from './auto-complete.service';

describe('AutoCompleteService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AutoCompleteService]
    });
  });

  it('should ...', inject([AutoCompleteService], (service: AutoCompleteService) => {
    expect(service).toBeTruthy();
  }));
});
