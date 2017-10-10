import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GkuAttendanceComponent } from './gku-attendance.component';

describe('GkuAttendanceComponent', () => {
  let component: GkuAttendanceComponent;
  let fixture: ComponentFixture<GkuAttendanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GkuAttendanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GkuAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
