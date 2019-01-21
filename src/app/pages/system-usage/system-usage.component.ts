import { Component, OnInit } from '@angular/core';
import { AmsSystemUsageService } from '../../services/ams/ams-system-usage.service';
import { System } from '../../models/system';
import { PagerModel } from '../../common/ng-structures';

@Component({
  selector: 'aqua-system-usage',
  templateUrl: './system-usage.component.html',
  styleUrls: ['./system-usage.component.css']
})
export class SystemUsageComponent implements OnInit {
  systems: PagerModel<System>;

  constructor(private amsSystemUsageService: AmsSystemUsageService) {
    this.systems = new PagerModel({
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
