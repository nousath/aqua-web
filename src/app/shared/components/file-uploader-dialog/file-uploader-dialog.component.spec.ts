import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileUploaderDialogComponent } from './file-uploader-dialog.component';

describe('FileUploaderDialogComponent', () => {
  let component: FileUploaderDialogComponent;
  let fixture: ComponentFixture<FileUploaderDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileUploaderDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileUploaderDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
