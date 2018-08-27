import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { Employee } from '../../../models/employee';
import { AmsEmployeeService } from '../../../services/index';
import { LocalStorageService } from '../../../services/local-storage.service';


class Sections {
  employee = false;
  attendance = false;
  settings = false;
  select(section: string) {
    this[section] = !this[section];
  }
}

@Component({
  selector: 'aqua-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css']
})
export class NavigationBarComponent implements OnInit {

  @Input() userType = '';
  @Input() sectionEmployee = '';
  @Input() isShowEmployeeTab = true
  @Output() isSelected: EventEmitter<boolean> = new EventEmitter<boolean>();

  currentUser: Employee = new Employee();
  orgCode = '';
  userId = '';
  sections: Sections = new Sections();
  subscription: Subscription;
  selectedEmp: Employee = new Employee();
  isSyncing = false;
  employeeSearch = true;


  constructor(private router: Router,
    private store: LocalStorageService,
    private amsEmployeeService: AmsEmployeeService,
  ) {
    this.userId = store.getItem('userId');

    this.subscription = router.events
      .filter(event => event instanceof NavigationEnd)
      .subscribe((event: NavigationEnd) => {
        window.scroll(0, 0);
      });
  }

  selectedTab() {
    let abc = true;
    // this.isSelected = true;
    this.isSelected.emit(abc);
  }

  ngOnInit() {
  }

}
