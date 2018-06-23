import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAttendanceLogsComponent } from './add-attendance-logs.component';

describe('AddAttendanceLogsComponent', () => {
  let component: AddAttendanceLogsComponent;
  let fixture: ComponentFixture<AddAttendanceLogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddAttendanceLogsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAttendanceLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
