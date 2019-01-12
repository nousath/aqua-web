import { Component, OnInit, Input, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { ToastyService } from 'ng2-toasty';

@Component({
  selector: 'aqua-get-value-dialog',
  templateUrl: './get-value-dialog.component.html',
  styleUrls: ['./get-value-dialog.component.css']
})
export class GetValueDialogComponent implements OnInit {

  @Input()
  title = 'Value'

  @Input()
  continueText = 'Continue'

  @Input()
  cancelText = 'Cancel'

  @Input()
  valueLabel = 'Value';

  @Input()
  value: any;

  @Input()
  type: string; // date, number etc

  @Input()
  showComment = false;

  comment = '';


  constructor(
    public dialogRef: MdDialogRef<GetValueDialogComponent>,
    private toastyService: ToastyService,
    @Inject(MD_DIALOG_DATA) public data: { type: any, showComment: boolean }
  ) { }



  ngOnInit() {
  }

  updated($event) {
    this.value = $event.currentTarget.value
  }

  updatedComment($event) {
    this.comment = $event.currentTarget.value
  }


  continue() {
    if (!this.value) {
      return this.toastyService.error(`${this.valueLabel} is required`)
    }

    if (this.showComment && !this.comment) {
      return this.toastyService.error(`please add a comment`)
    }

    this.dialogRef.close({
      value: this.value,
      comment: this.comment
    });
  }

}
