import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'aqua-shift-count',
  templateUrl: './shift-count.component.html',
  styleUrls: ['./shift-count.component.css']
})
export class ShiftCountComponent implements OnInit {

  @Input()
  count: Number;

  constructor() { }

  ngOnInit() {
  }

}
