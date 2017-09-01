import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunicationAppsComponent } from './communication-apps.component';

describe('CommunicationAppsComponent', () => {
  let component: CommunicationAppsComponent;
  let fixture: ComponentFixture<CommunicationAppsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommunicationAppsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunicationAppsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
