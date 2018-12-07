import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Category } from '../../models/index';
import { NgForm } from '@angular/forms';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'aqua-copy-content',
  templateUrl: './copy-content.component.html',
  styleUrls: ['./copy-content.component.css']
})
export class CopyContentComponent implements OnInit {
  activationKey;
  @ViewChild('copyForm') copyForm: NgForm;

  constructor(public dialogRef: MdDialogRef<CopyContentComponent>,
    @Inject(MD_DIALOG_DATA) public data: any) {
    this.activationKey = data
  }
  copyKey() {
    const input: any = document.getElementById('activationKey');
    input.select();
    const successful = document.execCommand('copy');
    // alert("Copied the text: " + input.value);
    const msg = successful ? 'successful' : 'unsuccessful';
    alert('Copying text command was ' + input.value)
  }
  ngOnInit() {
  }

}
