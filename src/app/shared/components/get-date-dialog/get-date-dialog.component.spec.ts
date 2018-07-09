import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetDateDialogComponent } from './get-date-dialog.component';

describe('GetDateDialogComponent', () => {
  let component: GetDateDialogComponent;
  let fixture: ComponentFixture<GetDateDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetDateDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetDateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
