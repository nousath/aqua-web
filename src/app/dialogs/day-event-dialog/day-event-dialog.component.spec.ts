import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DayEventDialogComponent } from './day-event-dialog.component';

describe('DayEventDialogComponent', () => {
  let component: DayEventDialogComponent;
  let fixture: ComponentFixture<DayEventDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DayEventDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DayEventDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
