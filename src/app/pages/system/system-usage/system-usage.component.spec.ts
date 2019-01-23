import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemUsageComponent } from './system-usage.component';

describe('SystemUsageComponent', () => {
  let component: SystemUsageComponent;
  let fixture: ComponentFixture<SystemUsageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemUsageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemUsageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
