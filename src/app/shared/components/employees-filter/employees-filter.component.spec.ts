import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeesFilterComponent } from './employees-filter.component';

describe('EmployeesFilterComponent', () => {
  let component: EmployeesFilterComponent;
  let fixture: ComponentFixture<EmployeesFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeesFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeesFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
