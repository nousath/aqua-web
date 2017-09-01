import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelTypeEditComponent } from './channel-type-edit.component';

describe('ChannelTypeEditComponent', () => {
  let component: ChannelTypeEditComponent;
  let fixture: ComponentFixture<ChannelTypeEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChannelTypeEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelTypeEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
