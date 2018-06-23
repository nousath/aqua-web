import { Component, OnInit, Input } from '@angular/core';
import { IUploader } from '../../../common/contracts/api/api.interface';
import { MdDialogRef } from '../../../../../node_modules/@angular/material';
import { ToastyService } from '../../../../../node_modules/ng2-toasty';

@Component({
  selector: 'aqua-file-uploader-dialog',
  templateUrl: './file-uploader-dialog.component.html',
  styleUrls: ['./file-uploader-dialog.component.css']
})
export class FileUploaderDialogComponent implements OnInit {

  @Input()
  name: string;

  @Input()

  downloadFormat: string;

  @Input()
  format: string;

  @Input()
  uploader: IUploader;

  errorMessage: string;

  file: File;

  constructor(
    public dialogRef: MdDialogRef<FileUploaderDialogComponent>,
    private toastyService: ToastyService
  ) { }

  ngOnInit() {
  }

  onSelect($event) {
    const files = $event.srcElement.files;
    this.file = files && files.length ? files[0] : null;
  }

  upload() {

    this.uploader.bulkUpload(this.file, this.format)
      .then((message) => {
        message = message || 'Done';
        this.toastyService.info({ title: 'Uploaded', msg: message });
        this.dialogRef.close(true);
      })
      .catch(err => {
        this.errorMessage = err;
        this.toastyService.error({ title: 'Error', msg: err })
      });
  }

  onCancel() {
    this.dialogRef.close(false);
  }

}
