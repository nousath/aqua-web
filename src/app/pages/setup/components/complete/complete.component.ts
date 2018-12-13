import { Component, OnInit } from '@angular/core';
import { AmsOrganizationService } from '../../../../services';
import { environment } from '../../../../../environments/environment';
// import { environment } from '../../../environments/environment';
// import { AmsOrganizationService } from '../../services/ams/ams-organization.service';
// import { CoolLocalStorage } from 'angular2-cool-storage';
import { LocalStorageService } from '../../../../services/local-storage.service';

@Component({
  selector: 'ams-gs-complete',
  templateUrl: './complete.component.html',
  styleUrls: ['./complete.component.css']
})
export class CompleteComponent implements OnInit {

  adminPanelUrl = '';

  constructor(private amsOrganizationService: AmsOrganizationService,
    private store: LocalStorageService,
  ) {
    // let user_access_token = this.store.getItem('external-token');
    // let org_code = this.store.getItem('orgCode');
    // this.adminPanelUrl = `${environment.apiUrls.adminPanel}/#/login?user_access_token=${user_access_token}&org_code=${org_code}`;
  }

  ngOnInit() {
  }


  next() {
    this.amsOrganizationService.nextStep('complete');
    // location.href = this.adminPanelUrl;
  }

}
