import { Component, ViewChild, HostListener } from '@angular/core';
import { ToastyConfig } from 'ng2-toasty';
import { Angulartics2GoogleAnalytics } from 'angulartics2';

import { environment } from '../environments/environment';
import { Router, NavigationEnd } from '@angular/router';
import { Employee } from './models';
import { MdSidenav } from '@angular/material';
import { EmsAuthService } from './services/ems/ems-auth.service';

@Component({
  selector: 'aqua-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'aqua';
  envName: string;

  currentUser: Employee;

  sideNavMode = 'side';

  sideNavOpened = true;

  @ViewChild('sidenav') sidenav: MdSidenav;

  constructor(
    angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics,
    private toastyConfig: ToastyConfig,
    private auth: EmsAuthService,
    private router: Router
  ) {
    this.toastyConfig.theme = 'material';
    this.toastyConfig.timeout = 5000;
    this.toastyConfig.showClose = true;
    this.toastyConfig.limit = 2;
    this.toastyConfig.position = 'top-right';

    if (environment.name && environment.name !== 'prod') {
      this.envName = environment.name;
    }

    this.currentUser = auth.getCurrentUser();

    auth.currentUserChanges.subscribe(user => {
      this.currentUser = user;
    })

    if (window.innerWidth > 800) {
      this.sideNavMode = 'side';
      this.sideNavOpened = true;
    } else {
      this.sideNavMode = 'over';
      this.sideNavOpened = false;
    }


    // router.events
    //   .filter(event => event instanceof NavigationEnd)
    //   .subscribe((event: NavigationEnd) => {
    //     this.checkSection(event.url);
    //     window.scroll(0, 0);
    //   });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (window.innerWidth > 800) {
      this.sideNavMode = 'side';
      this.sideNavOpened = true;
    } else {
      this.sideNavMode = 'over';
      this.sideNavOpened = false;
    }
  }

  // checkSection(url: string) {
  //   if (url.startsWith('/employees')) {
  //     this.sections.employee = true;
  //   }
  //   if (url.startsWith('/attendances') || url === '') {
  //     this.sections.attendance = true;
  //   }
  //   if (url.startsWith('/settings')) {
  //     this.sections.settings = true;
  //   }
  // }


  // ngOnDestroy() {
  //   this.subscription.unsubscribe();
  // }

  closeNav($event) {
    if ($event === true)
      this.sidenav.close();
  }
  logout() {
    this.auth.logout().subscribe(() => {
      this.currentUser = null;
      this.router.navigate(['/login']);
    })
  }
}
