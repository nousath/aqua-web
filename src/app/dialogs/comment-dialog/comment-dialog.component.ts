import { Component, OnInit, Input } from '@angular/core';
import { MdDialogRef } from '@angular/material';

@Component({
  selector: 'aqua-comment-dialog',
  templateUrl: './comment-dialog.component.html',
  styleUrls: ['./comment-dialog.component.css']
})
export class CommentDialogComponent implements OnInit {

  @Input()
  comment: string;
  constructor(public dialogRef: MdDialogRef<CommentDialogComponent>) { }
  save() {
    this.dialogRef.close(this.comment);
  }
  ngOnInit() {
  }

}
