import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveConfirmDialogComponent } from './leave-confirm-dialog.component';

describe('LeaveConfirmDialogComponent', () => {
  let component: LeaveConfirmDialogComponent;
  let fixture: ComponentFixture<LeaveConfirmDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeaveConfirmDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
