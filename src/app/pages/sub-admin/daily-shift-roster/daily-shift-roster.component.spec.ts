import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyShiftRosterComponent } from './daily-shift-roster.component';

describe('DailyShiftRosterComponent', () => {
  let component: DailyShiftRosterComponent;
  let fixture: ComponentFixture<DailyShiftRosterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyShiftRosterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyShiftRosterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
