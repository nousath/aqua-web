import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyContentComponent } from './copy-content.component';

describe('CopyContentComponent', () => {
 let component: CopyContentComponent;
 let fixture: ComponentFixture<CopyContentComponent>;

 beforeEach(async(() => {
   TestBed.configureTestingModule({
     declarations: [ CopyContentComponent ]
   })
   .compileComponents();
 }));

 beforeEach(() => {
   fixture = TestBed.createComponent(CopyContentComponent);
   component = fixture.componentInstance;
   fixture.detectChanges();
 });

 it('should be created', () => {
   expect(component).toBeTruthy();
 });
);
