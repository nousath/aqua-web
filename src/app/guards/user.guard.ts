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
    const user: Employee = this.store.getObject('user') as Employee;
    const roleKey: string = this.store.getItem('roleKey');
    const orgCode: string = this.store.getItem('orgCode');
    if (!roleKey || !orgCode) {
      this.router.navigate(['/login']);
      return false;
    }
    if (user) {
      ga('set', '&uid', `${user.name} ${user.email}`)
    }
    return true;
  }
}
