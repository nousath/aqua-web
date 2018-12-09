import { Injectable, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { ImageEditorComponent } from '../shared/components/image-editor/image-editor.component';
import { Doc } from '../models/doc.model';
import { SELECT_MAX_OPTIONS_DISPLAYED } from '@angular/material';
import { Entity } from '../models/entity.model';

@Injectable()
export class UxService {

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver
  ) { }

  getImageEditor(options: any, viewContainerRef: ViewContainerRef): Observable<Doc> {

    const factory = this.componentFactoryResolver.resolveComponentFactory(ImageEditorComponent);
    const ref = viewContainerRef.createComponent(factory);

    const editor = ref.instance;
    editor.file = options.file;
    editor.entity = new Entity(options.entity);
    editor.folder = options.folder;

    if (options.title !== undefined) { editor.title = options.title; }
    if (options.isFixedRatio !== undefined) { editor.isFixedRatio = options.isFixedRatio; }
    if (options.ratio !== undefined) { editor.ratio = options.ratio; }
    if (options.isEditMandatory !== undefined) {
      editor.isEdit = options.isEditMandatory;
      editor.isEditMandatory = options.isEditMandatory;
    }
    if (options.isCropBoxResizable !== undefined) { editor.isCropBoxResizable = options.isCropBoxResizable; }
    if (options.width !== undefined) { editor.width = options.width; }
    if (options.height !== undefined) { editor.height = options.height; }
    if (options.cropArea !== undefined) { editor.cropArea = options.cropArea; }
    if (options.ratioList !== undefined) { editor.ratioList = options.ratioList; }
    if (options.ok && options.ok.label) { editor.okLabel = options.ok.label; }
    if (options.cancel) {
      editor.cancelable = true;
      if (options.cancel.label) { editor.cancelLabel = options.cancel.label; }
    }

    editor.open();
    ref.changeDetectorRef.detectChanges();

    const subject = new Subject<Doc>()

    editor.onCancel.subscribe(() => {
      editor.close();
      subject.error('cancelled');
    });

    editor.onOk.subscribe((doc: Doc) => {
      editor.close();
      subject.next(doc);
    });

    return subject.asObservable()
  }
}
