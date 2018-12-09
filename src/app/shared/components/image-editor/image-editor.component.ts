import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';


import Cropper from 'cropperjs'
import { Entity } from '../../../models/entity.model';
import { DriveService } from '../../services/drive.service';
import { Doc } from '../../../models/doc.model';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'image-editor',
  templateUrl: 'image-editor.component.html',
  styleUrls: ['image-editor.component.css'],
  // encapsulation: ViewEncapsulation.None
})
export class ImageEditorComponent implements OnInit, AfterViewInit {
  @Input() title = 'Image Editor';
  @Input() body: string;
  @Input() file: File;
  @Input() template: any;
  @Input() cancelable: boolean;

  @Output() onCancel: EventEmitter<Object> = new EventEmitter();
  @Output() onOk: EventEmitter<Doc> = new EventEmitter();

  @Input() okLabel = 'Ok';
  @Input() cancelLabel = 'Cancel';
  @Input() isFixedRatio = false;
  @Input() isCropBoxResizable = true;
  @Input() ratio = 1;
  @Input() width: number;
  @Input() height: number;
  @Input() cropArea = 0.9;
  visibility: boolean;
  processing: boolean;
  @Input() isEdit = true;
  @Input() isEditMandatory = true;
  @Input() ratioList: { name: string, w: number, h: number }[] = [];

  @Input() tools: string[] = []

  @Input() entity: Entity;
  @Input() folder: string;
  cropper: Cropper;

  options = {
    crop: true,
    zoom: false,
    move: false,
    rotate: false,
    flip: false,
    ratio: false,
    reset: false
  }

  constructor(
    private driveService: DriveService
  ) {
  }

  selectRatio(ratio: { name: string, w: number, h: number }) {
    this.width = ratio.w;
    this.height = ratio.h;
    this.cropper.setAspectRatio(ratio.w / ratio.h);
  }

  ngOnInit() {


  }

  ngAfterViewInit() {
    const image = document.getElementById('image') as HTMLImageElement;
    image.onload = () => {
      // this.cropper = new Cropper(image);

      this.cropper = new Cropper(image, {
        dragMode: 'crop', // only in case of 'FALSE' value
        aspectRatio: this.isFixedRatio ? this.ratio : NaN, // for free crop
        autoCrop: true,
        autoCropArea: 0.9,
        restore: false,
        guides: true,
        center: true,
        responsive: true,
        highlight: false,
        cropBoxMovable: true,
        cropBoxResizable: false,
        toggleDragModeOnDblclick: true,
      });
    };
    this.dataUrl(this.file, (err, base64) => {
      image.src = base64;
    })
  }


  toggleEdit(value: boolean) {
  }

  okClicked() {
    this.processing = true;

    const result = this.cropper.getCroppedCanvas({ width: this.width, height: this.height });
    try {
      result.toBlob((blob: any) => {
        blob.name = this.file.name;
        blob.lastModifiedDate = new Date();

        this.driveService.upload(this.entity, blob, this.folder).then(doc => {
          this.processing = false;
          this.onOk.emit(doc)
        })
      }, 'image/jpeg', 0.8)
    } catch (err) {
      this.processing = false;
    }


  }

  cancelClicked() {
    this.onCancel.emit();
  }

  close() {
    this.processing = false;
    this.visibility = false;
  }

  open() {
    this.visibility = true;
  }

  private initCropper(image) {
    // const img = new Image();

    //   this.isCropBoxResizable = this.isCropBoxResizable === false ? false : true

    // image.onload = () => {
    //   this.cropper = new Cropper(image, {
    //     dragMode: this.isCropBoxResizable ? 'crop' : 'move', // only in case of 'FALSE' value
    //     aspectRatio: this.isFixedRatio ? this.ratio : NaN, // for free crop
    //     autoCrop: true,
    //     autoCropArea: this.cropArea ? this.cropArea : 0.9,
    //     restore: false,
    //     guides: true,
    //     center: true,
    //     responsive: true,
    //     highlight: false,
    //     cropBoxMovable: true,
    //     cropBoxResizable: this.isCropBoxResizable,
    //     toggleDragModeOnDblclick: true,
    //   });
    // };


    // img.src = image['src'];
  }

  private dataUrl(file: File, callback) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const target: any = e.target;
      callback(null, target.result);
    }
    reader.readAsDataURL(file);
  }

}
