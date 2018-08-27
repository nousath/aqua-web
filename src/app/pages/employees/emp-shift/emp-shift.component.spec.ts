import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpShiftComponent } from './emp-shift.component';

describe('EmpShiftComponent', () => {
  let component: EmpShiftComponent;
  let fixture: ComponentFixture<EmpShiftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpShiftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpShiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
