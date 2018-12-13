import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SyncappComponent } from './syncapp.component';

describe('SyncappComponent', () => {
  let component: SyncappComponent;
  let fixture: ComponentFixture<SyncappComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SyncappComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SyncappComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
