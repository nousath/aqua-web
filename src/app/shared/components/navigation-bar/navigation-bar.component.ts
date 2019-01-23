import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Role } from '../../../models/ems/role';
import { EmsAuthService } from '../../../services/ems/ems-auth.service';


class Sections {
  home = false;
  employee = false;
  attendance = false;
  reports = false;
  settings = false;
  system = false;
  select(section: string) {
    this[section] = !this[section];
  }
}

class NavItem {
  routerLink: string[];
  title: string;
}

@Component({
  selector: 'aqua-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css']
})
export class NavigationBarComponent implements OnInit {

  @Output() isSelected: EventEmitter<boolean> = new EventEmitter<boolean>();

  currentRole: Role;

  orgCode = '';
  userId = '';
  sections: Sections = new Sections();
  subscription: Subscription;
  isSyncing = false;
  employeeSearch = true;


  constructor(
    private router: Router,
    public auth: EmsAuthService
  ) {

    this.subscription = router.events
      .filter(event => event instanceof NavigationEnd)
      .subscribe((event: NavigationEnd) => {
        window.scroll(0, 0);
      });

    this.auth.roleChanges.subscribe(role => {
      this.currentRole = role;
    })
  }
  selectedTab() {
    this.isSelected.emit(true);
  }

  ngOnInit() {
  }

}
