import { Injectable } from '@angular/core';
import { Router, Route } from '@angular/router';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { LocalStorageService } from '../services/local-storage.service';
import { User } from '../models/user';
import { Employee } from '../models/employee';
declare var ga: any;

@Injectable()
export class UserGuard implements CanActivate {

  constructor(private router: Router, private store: LocalStorageService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    let user: Employee = this.store.getObject('user') as Employee;
    let amstoken: string = this.store.getItem('ams_token');
    let orgCode: string = this.store.getItem('orgCode');
    if (!amstoken || !orgCode) {
      this.router.navigate(['/login']);
      return false;
    }
    if (user) {
      ga('set', '&uid', `${user.name} ${user.email}`)
    }
    return true;
  }
}
