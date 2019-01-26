import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeekOffComponent } from './week-off.component';

describe('WeekOffComponent', () => {
  let component: WeekOffComponent;
  let fixture: ComponentFixture<WeekOffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeekOffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeekOffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
