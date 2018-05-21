import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportListsComponent } from './report-lists.component';

describe('ReportListsComponent', () => {
  let component: ReportListsComponent;
  let fixture: ComponentFixture<ReportListsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportListsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
