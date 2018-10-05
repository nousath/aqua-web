import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftCountComponent } from './shift-count.component';

describe('ShiftCountComponent', () => {
  let component: ShiftCountComponent;
  let fixture: ComponentFixture<ShiftCountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShiftCountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShiftCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
