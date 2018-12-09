import { Component, OnInit, Input } from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-processing-indicator',
  templateUrl: './processing-indicator.component.html',
  styleUrls: ['./processing-indicator.component.css']
})
export class ProcessingIndicatorComponent implements OnInit {

  @Input()
  inline = false;

  constructor() { }

  ngOnInit() {
  }

}
