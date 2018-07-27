import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyMobileViewComponent } from './monthly-mobile-view.component';

describe('MonthlyMobileViewComponent', () => {
  let component: MonthlyMobileViewComponent;
  let fixture: ComponentFixture<MonthlyMobileViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MonthlyMobileViewComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlyMobileViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
