import { Component, OnInit, OnDestroy } from '@angular/core';
import { CurrentPage } from '../../../../models';
import { Subscription } from 'rxjs/Subscription';
import { PushEventService } from '../../../../services/push-event.service';
import { AmsOrganizationService } from '../../../../services';
// import { PushEventService } from '../../services/push-event.service';
// import { CurrentPage } from '../../models/push-events';
// import { Subscription } from 'rxjs/Rx';
// import { AmsOrganizationService } from '../../services/ams/ams-organization.service';

export class Dot {
  url = '';
  imgUrl = '';
  page = '';
}

@Component({
  selector: 'ams-gs-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.css']
})
export class WizardComponent implements OnInit, OnDestroy {

  currentPage: CurrentPage = new CurrentPage();
  subscription: Subscription;
  dots: Dot[] = [
    { page: 'employees', imgUrl: 'assets/images/dots/grey.png', url: '/pages/wizard/employees' },
    { page: 'devices', imgUrl: 'assets/images/dots/grey.png', url: '/pages/wizard/devices' },
    { page: 'syncapp', imgUrl: 'assets/images/dots/grey.png', url: '/pages/wizard/syncapp' },
    { page: 'alerts', imgUrl: 'assets/images/dots/grey.png', url: '/pages/wizard/alerts' },
  ];

  constructor(private pushEventService: PushEventService,
    private amsOrganizationService: AmsOrganizationService,
  ) {
    this.subscription = pushEventService.currentPage.subscribe(
      (data: CurrentPage) => {
        if (data)
          this.currentPage = data;
      }
    );
  }
  next() {
    this.amsOrganizationService.nextStep(this.currentPage.onBoardingStatus, this.currentPage.nextUrl);
  }
  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
