import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpLeavesComponent } from './emp-leaves.component';

describe('EmpLeavesComponent', () => {
  let component: EmpLeavesComponent;
  let fixture: ComponentFixture<EmpLeavesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EmpLeavesComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpLeavesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
