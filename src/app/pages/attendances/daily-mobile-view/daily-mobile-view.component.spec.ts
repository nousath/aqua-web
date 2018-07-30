import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyMobileViewComponent } from './daily-mobile-view.component';

describe('DailyMobileViewComponent', () => {
  let component: DailyMobileViewComponent;
  let fixture: ComponentFixture<DailyMobileViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DailyMobileViewComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyMobileViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
