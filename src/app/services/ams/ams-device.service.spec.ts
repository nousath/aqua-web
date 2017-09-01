import { TestBed, inject } from '@angular/core/testing';

import { AmsDeviceService } from './ams-device.service';

describe('AmsDeviceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AmsDeviceService]
    });
  });

  it('should be created', inject([AmsDeviceService], (service: AmsDeviceService) => {
    expect(service).toBeTruthy();
  }));
});
