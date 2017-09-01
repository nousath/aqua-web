import { TestBed, inject } from '@angular/core/testing';

import { AmsTimelogsService } from './ams-timelogs.service';

describe('AmsTimelogsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AmsTimelogsService]
    });
  });

  it('should be created', inject([AmsTimelogsService], (service: AmsTimelogsService) => {
    expect(service).toBeTruthy();
  }));
});
