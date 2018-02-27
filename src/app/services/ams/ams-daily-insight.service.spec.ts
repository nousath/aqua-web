import { TestBed, inject } from '@angular/core/testing';

import { AmsDailyInsightService } from './ams-daily-insight.service';

describe('AmsDailyInsightService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AmsDailyInsightService]
    });
  });

  it('should be created', inject([AmsDailyInsightService], (service: AmsDailyInsightService) => {
    expect(service).toBeTruthy();
  }));
});
