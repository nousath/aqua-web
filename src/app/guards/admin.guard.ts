import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { EmsAuthService } from '../services/ems/ems-auth.service';

@Injectable()
export class AdminGuard implements CanActivate {

  constructor(private auth: EmsAuthService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {

    if (!this.auth.getCurrentKey()) {
      this.auth.goHome();
      return false
    }

    const currentUser = this.auth.currentEmployee();
    if (!currentUser) {
      this.auth.goHome();
      return false
    }
    if (currentUser.userType === 'superadmin' || currentUser.userType === 'admin') {
      return true;
    }

    this.auth.goHome();
    return false;
  }
}
