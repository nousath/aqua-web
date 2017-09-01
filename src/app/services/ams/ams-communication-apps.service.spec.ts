import { TestBed, inject } from '@angular/core/testing';

import { AmsCommunicationAppsService } from './ams-communication-apps.service';

describe('AmsCommunicationAppsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AmsCommunicationAppsService]
    });
  });

  it('should be created', inject([AmsCommunicationAppsService], (service: AmsCommunicationAppsService) => {
    expect(service).toBeTruthy();
  }));
});
