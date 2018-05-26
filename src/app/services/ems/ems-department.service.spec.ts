import { TestBed, inject } from '@angular/core/testing';

import { EmsDepartmentService } from './ems-department.service';

describe('EmsDepartmentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmsDepartmentService]
    });
  });

  it('should be created', inject([EmsDepartmentService], (service: EmsDepartmentService) => {
    expect(service).toBeTruthy();
  }));
});
