import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtendShiftDialogComponent } from './extend-shift-dialog.component';

describe('ExtendShiftDialogComponent', () => {
  let component: ExtendShiftDialogComponent;
  let fixture: ComponentFixture<ExtendShiftDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtendShiftDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtendShiftDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
