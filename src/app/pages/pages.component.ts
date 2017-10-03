import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Employee } from '../models/employee';
import { AutoCompleteService } from '../services/auto-complete.service';
import { Observable, Subscription } from 'rxjs/Rx';
import { AmsEmployeeService } from '../services/ams/ams-employee.service';
import { ToastyService } from 'ng2-toasty';
import { LocalStorageService } from '../services/local-storage.service';

class Sections {
  employee: boolean = false;
  attendance: boolean = false;
  settings: boolean = false;
  select(section: string) {
    this[section] = !this[section];
  }
}

@Component({
  selector: 'aqua-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css']
})
export class PagesComponent implements OnInit, OnDestroy {

  currentUser: Employee = new Employee();
  orgCode: string = '';
  sections: Sections = new Sections();

  selectedEmp: Employee = new Employee();
  subscription: Subscription;
  isSyncing: boolean = false;
  isShowEmployeeTab: boolean = false;
  userType: string = 'superadmin';

  constructor(private store: LocalStorageService,
    private autoCompleteService: AutoCompleteService,
    private amsEmployeeService: AmsEmployeeService,
    private toastyService: ToastyService,
    private router: Router) {
    this.currentUser = store.getObject('user') as Employee;
    this.userType = this.currentUser.userType;
    this.orgCode = store.getItem('orgCode').toLowerCase();
    this.isShowEmployeeTab = this.orgCode == 'gku' || this.orgCode == 'sus' || this.orgCode == 'kmt' ? false : true;


    this.subscription = router.events
      .filter(event => event instanceof NavigationEnd)
      .subscribe((event: NavigationEnd) => {
       this.checkSection(event.url);
        window.scroll(0, 0)
      });
  }

  checkSection(url: string) {
    if (url.startsWith("/pages/employees"))
      this.sections.employee = true
    if (url.startsWith("/pages/attendances") || url == '/pages')
      this.sections.attendance = true
    if (url.startsWith("/pages/settings"))
      this.sections.settings = true

  }

  onSelectEmp(emp: Employee) {
    if (emp.id) {
      this.router.navigate(['pages/attendances/daily', emp.id]);
      this.selectedEmp = new Employee();
    }
  }

  empSource(keyword: string): Observable<Employee[]> {
    return this.autoCompleteService.searchByKey<Employee>('name', keyword, 'ams', 'employees');
  }

  empFormatter(data: Employee): string {
    return data.name;
  }

  empListFormatter(data: Employee): string {
    return `${data.name} (${data.code})`;
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }


  syncEmployees() {
    this.isSyncing = true;
    this.amsEmployeeService.syncEmployees.simpleGet().then(
      data => {
        this.isSyncing = false;
        this.toastyService.info({ title: 'Info', msg: 'Syncing is in progress. You will be infromed via email When its done' })
      }
    ).catch(err => { this.isSyncing = false; this.toastyService.error({ title: 'Error', msg: err }) })

  }

  logout() {
    this.store.clear();
    switch (this.orgCode) {
      case 'gku':
        location.href = 'http://gku.edualaya.com'
        break;
      case 'aqua':
        location.href = 'http://gku.edualaya.com'
        break;
      default:
        this.router.navigate(['/login']);
        break;

    }

  }

}
