import { TestBed, inject } from '@angular/core/testing';

import { EmsEmployeeService } from './ems-employee.service';

describe('EmsEmployeeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmsEmployeeService]
    });
  });

  it('should be created', inject([EmsEmployeeService], (service: EmsEmployeeService) => {
    expect(service).toBeTruthy();
  }));
});
