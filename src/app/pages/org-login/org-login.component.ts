import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { AmsEmployeeService } from '../../services/ams';
import { EmsEmployeeService } from '../../services/ems';
import { ToastyService } from 'ng2-toasty';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'aqua-org-login',
  templateUrl: './org-login.component.html',
  styleUrls: ['./org-login.component.css']
})
export class OrgLoginComponent implements OnInit, OnDestroy {

  subscription: Subscription;

  constructor(private activatedRoute: ActivatedRoute,
    private emsEmployeeService: EmsEmployeeService,
    private amsEmployeeService: AmsEmployeeService,
    private store: LocalStorageService,
    private router: Router,
    private toastyService: ToastyService) {
    this.subscription = activatedRoute.queryParams.subscribe(queryParams => {
      const roleKey: string = queryParams['role-key'];
      let orgCode: string = queryParams['org-code'];
      if (!roleKey || !orgCode) {
        return alert('Role or organization Not Found')
      }
      orgCode = orgCode.toLowerCase();
      this.store.clear();
      this.store.setItem('roleKey', roleKey);
      this.store.setItem('orgCode', orgCode);

      const tempData: any = { 'device': { 'id': 'string' } };

      this.amsEmployeeService.signInViaExternalToken.create(tempData).then(
        (amsUser) => {
          amsUser.userType = 'superadmin';
          this.store.setObject('user', amsUser);
          this.store.setItem('orgCode', amsUser.organization.code ? amsUser.organization.code.toLowerCase() : orgCode);
          this.router.navigate(['/pages']);
        }
      ).catch(err => { this.toastyService.error({ title: 'Error', msg: err }) });
    })

  }

  ngOnInit() {
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
