import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendancesComponent } from './attendances.component';

describe('AttendancesComponent', () => {
  let component: AttendancesComponent;
  let fixture: ComponentFixture<AttendancesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttendancesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
