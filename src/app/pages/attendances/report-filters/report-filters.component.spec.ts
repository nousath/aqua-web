import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportFiltersComponent } from './report-filters.component';

describe('ReportFiltersComponent', () => {
  let component: ReportFiltersComponent;
  let fixture: ComponentFixture<ReportFiltersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportFiltersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
