import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlterTypesComponent } from './alter-types.component';

describe('AlterTypesComponent', () => {
  let component: AlterTypesComponent;
  let fixture: ComponentFixture<AlterTypesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlterTypesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlterTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
