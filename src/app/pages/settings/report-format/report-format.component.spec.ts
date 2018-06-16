import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportFormatComponent } from './report-format.component';

describe('ReportFormatComponent', () => {
  let component: ReportFormatComponent;
  let fixture: ComponentFixture<ReportFormatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReportFormatComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportFormatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
