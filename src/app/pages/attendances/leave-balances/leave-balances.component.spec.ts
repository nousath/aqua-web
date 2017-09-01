import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveBalancesComponent } from './leave-balances.component';

describe('LeaveBalancesComponent', () => {
  let component: LeaveBalancesComponent;
  let fixture: ComponentFixture<LeaveBalancesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeaveBalancesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveBalancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
