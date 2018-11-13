import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SyncDialogComponent } from './sync-dialog.component';

describe('SyncDialogComponent', () => {
  let component: SyncDialogComponent;
  let fixture: ComponentFixture<SyncDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SyncDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SyncDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
