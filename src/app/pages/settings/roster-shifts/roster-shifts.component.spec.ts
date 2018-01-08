import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RosterShiftsComponent } from './roster-shifts.component';

describe('RosterShiftsComponent', () => {
  let component: RosterShiftsComponent;
  let fixture: ComponentFixture<RosterShiftsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RosterShiftsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RosterShiftsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
