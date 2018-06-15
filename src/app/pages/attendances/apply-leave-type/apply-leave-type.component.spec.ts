import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyLeaveTypeComponent } from './apply-leave-type.component';

describe('ApplyLeaveTypeComponent', () => {
  let component: ApplyLeaveTypeComponent;
  let fixture: ComponentFixture<ApplyLeaveTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplyLeaveTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplyLeaveTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
