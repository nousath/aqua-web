import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlterEditComponent } from './alter-edit.component';

describe('AlterEditComponent', () => {
  let component: AlterEditComponent;
  let fixture: ComponentFixture<AlterEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlterEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlterEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
