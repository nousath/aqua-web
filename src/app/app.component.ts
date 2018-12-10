import { Component, ViewChild, HostListener, OnInit } from '@angular/core';
import { ToastyConfig } from 'ng2-toasty';
import { Angulartics2GoogleAnalytics } from 'angulartics2';

import { environment } from '../environments/environment';
import { Router, NavigationEnd } from '@angular/router';
import { Employee } from './models';
import { MdSidenav } from '@angular/material';
import { EmsAuthService } from './services/ems/ems-auth.service';
import { inherits } from 'util';

@Component({
  selector: 'aqua-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

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
    this.auth.currentUserChanges.subscribe(user => {
      this.currentUser = user;
      this.onResize(null)
    })
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {

    if (!this.currentUser) {
      this.sideNavOpened = false;
    } else {
      if (window.innerWidth > 800) {
        this.sideNavMode = 'side';
        this.sideNavOpened = true;
      } else {
        this.sideNavMode = 'over';
        this.sideNavOpened = false;
      }

    }
  }

  ngOnInit(): void {
    this.currentUser = this.auth.getCurrentUser();
    this.onResize(null);
  }


  logout() {
    this.auth.logout().subscribe(() => {
    })
  }
}
