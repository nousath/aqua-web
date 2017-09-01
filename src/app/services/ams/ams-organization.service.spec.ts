import { TestBed, inject } from '@angular/core/testing';

import { AmsOrganizationService } from './ams-organization.service';

describe('AmsOrganizationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AmsOrganizationService]
    });
  });

  it('should be created', inject([AmsOrganizationService], (service: AmsOrganizationService) => {
    expect(service).toBeTruthy();
  }));
});
