import { TestBed, inject } from '@angular/core/testing';

import { AmsEmployeeService } from './ams-employee.service';

describe('AmsEmployeeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AmsEmployeeService]
    });
  });

  it('should be created', inject([AmsEmployeeService], (service: AmsEmployeeService) => {
    expect(service).toBeTruthy();
  }));
});
