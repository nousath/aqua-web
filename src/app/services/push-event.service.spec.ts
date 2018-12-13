import { TestBed, inject } from '@angular/core/testing';

import { PushEventService } from './push-event.service';

describe('PushEventService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PushEventService]
    });
  });

  it('should be created', inject([PushEventService], (service: PushEventService) => {
    expect(service).toBeTruthy();
  }));
});
