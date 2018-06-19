import { Injectable } from '@angular/core';
import { Router, Route } from '@angular/router';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { LocalStorageService } from '../services/local-storage.service';
import { Employee } from '../models/employee';

@Injectable()
export class AdminGuard implements CanActivate {

  constructor(private router: Router, private store: LocalStorageService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    const currentUser: Employee = this.store.getObject('user') as Employee;
    if (currentUser.userType === 'superadmin' || currentUser.userType === 'admin'  || currentUser.userType === 'normal') {
      return true;
    }
    this.router.navigate(['/pages/subAdmin']);
    return false;
  }
  // if (currentUser.userType == 'admin') {
    //   this.router.navigate([`/pages/daily/${currentUser.id}`]);
    //   return false;
    // }

    // return false;
}
