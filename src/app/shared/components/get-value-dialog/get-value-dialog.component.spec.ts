import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetValueDialogComponent } from './get-value-dialog.component';

describe('GetValueDialogComponent', () => {
  let component: GetValueDialogComponent;
  let fixture: ComponentFixture<GetValueDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetValueDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetValueDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
