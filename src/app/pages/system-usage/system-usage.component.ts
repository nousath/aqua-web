import { Component, OnInit } from '@angular/core';
import { AmsSystemUsageService } from '../../services/ams/ams-system-usage.service';
import { Page } from '../../common/contracts/page';
import { System } from '../../models/system';

@Component({
  selector: 'aqua-system-usage',
  templateUrl: './system-usage.component.html',
  styleUrls: ['./system-usage.component.css']
})
export class SystemUsageComponent implements OnInit {
  systems: Page<System>;

  constructor(private amsSystemUsageService: AmsSystemUsageService ) {
    this.systems = new Page({
      api: amsSystemUsageService.systems
    });
    this.getSystemDetails();
   }

   getSystemDetails() {
    this.systems.fetch();
   }

  ngOnInit() {
  }

}
