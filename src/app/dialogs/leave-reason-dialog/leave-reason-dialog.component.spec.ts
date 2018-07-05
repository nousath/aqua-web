import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveReasonDialogComponent } from './leave-reason-dialog.component';

describe('LeaveReasonDialogComponent', () => {
  let component: LeaveReasonDialogComponent;
  let fixture: ComponentFixture<LeaveReasonDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LeaveReasonDialogComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveReasonDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
