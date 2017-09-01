import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftTypeNewComponent } from './shift-type-new.component';

describe('ShiftTypeNewComponent', () => {
  let component: ShiftTypeNewComponent;
  let fixture: ComponentFixture<ShiftTypeNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShiftTypeNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShiftTypeNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
