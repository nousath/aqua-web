import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelievingDialogComponent } from './relieving-dialog.component';

describe('RelievingDialogComponent', () => {
  let component: RelievingDialogComponent;
  let fixture: ComponentFixture<RelievingDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RelievingDialogComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelievingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
