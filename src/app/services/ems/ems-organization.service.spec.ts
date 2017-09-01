import { TestBed, inject } from '@angular/core/testing';

import { EmsOrganizationService } from './ems-organization.service';

describe('EmsOrganizationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmsOrganizationService]
    });
  });

  it('should be created', inject([EmsOrganizationService], (service: EmsOrganizationService) => {
    expect(service).toBeTruthy();
  }));
});
