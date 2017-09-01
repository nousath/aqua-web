import { Component } from '@angular/core';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';


@Component({
  selector: 'aqua-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'aqua';
  constructor(private toastyService: ToastyService, private toastyConfig: ToastyConfig) {
    this.toastyConfig.theme = 'material';
    this.toastyConfig.timeout = 5000;
    this.toastyConfig.showClose = true;
    this.toastyConfig.limit = 2;
    this.toastyConfig.position = "top-right"
  }
}
