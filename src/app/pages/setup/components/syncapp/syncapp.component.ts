import { Component, OnInit } from '@angular/core';
import { ToastyService } from 'ng2-toasty';
import { AmsOrganizationService } from '../../../../services';
import { PushEventService } from '../../../../services/push-event.service';
import { CurrentPage } from '../../../../models';

@Component({
  selector: 'ams-gs-syncapp',
  templateUrl: './syncapp.component.html',
  styleUrls: ['./syncapp.component.css']
})
export class SyncappComponent implements OnInit {

  isDownloading = false;
  activationKey = '';

  constructor(private toastyService: ToastyService,
    private amsOrganizationService: AmsOrganizationService,
    private pushEventService: PushEventService) {

    const page: CurrentPage = new CurrentPage();
    page.header = 'Download Sync Service';
    page.description = 'You can install sync service automatically';
    page.nextUrl = '/pages/wizard/alerts';
    page.page = 'syncapp';
    page.onBoardingStatus = 'syncapp';
    pushEventService.pushPage(page);
    this.getActivationKey();
  }

  next() {
    this.amsOrganizationService.nextStep('syncapp', '/pages/wizard/alerts');
  }

  copyKey() {
    const input: any = document.querySelector('#activationKey');
    input.select()
    try {
      const successful = document.execCommand('copy');
      const msg = successful ? 'successful' : 'unsuccessful';
      console.log('Copying text command was ' + msg);
    } catch (err) {
      console.log('Oops, unable to copy');
    }
  }


  getActivationKey() {
    this.isDownloading = true;
    this.amsOrganizationService.organizations.get('my').then(
      data => {
        this.activationKey = data.activationKey;
        this.isDownloading = false;
      }
    ).catch(err => { this.isDownloading = false; this.toastyService.error({ title: 'Error', msg: err }) });
  }

  ngOnInit() {
  }

}
