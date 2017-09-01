import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveActionDialogComponent } from './leave-action-dialog.component';

describe('LeaveActionDialogComponent', () => {
  let component: LeaveActionDialogComponent;
  let fixture: ComponentFixture<LeaveActionDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeaveActionDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveActionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
