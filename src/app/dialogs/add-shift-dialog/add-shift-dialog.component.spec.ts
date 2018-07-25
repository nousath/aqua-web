import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddShiftDialogComponent } from './add-shift-dialog.component';

describe('AddShiftDialogComponent', () => {
  let component: AddShiftDialogComponent;
  let fixture: ComponentFixture<AddShiftDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddShiftDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddShiftDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
