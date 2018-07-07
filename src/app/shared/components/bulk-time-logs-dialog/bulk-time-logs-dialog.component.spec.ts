import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkTimeLogsDialogComponent } from './bulk-time-logs-dialog.component';

describe('BulkTimeLogsDialogComponent', () => {
  let component: BulkTimeLogsDialogComponent;
  let fixture: ComponentFixture<BulkTimeLogsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkTimeLogsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkTimeLogsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
