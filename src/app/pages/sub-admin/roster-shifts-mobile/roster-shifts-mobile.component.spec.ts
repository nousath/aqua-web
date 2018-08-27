import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RosterShiftsMobileComponent } from './roster-shifts-mobile.component';

describe('RosterShiftsMobileComponent', () => {
  let component: RosterShiftsMobileComponent;
  let fixture: ComponentFixture<RosterShiftsMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RosterShiftsMobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RosterShiftsMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
