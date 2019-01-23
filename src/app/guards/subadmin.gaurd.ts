import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { EmsAuthService } from '../services';

@Injectable()
export class SubAdminGuard implements CanActivate {

  constructor(private auth: EmsAuthService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {


    const role = this.auth.currentRole();
    if (!role || !role.employee) {
      this.auth.goHome();
      return false
    }
    if (role.employee.type === 'admin' || role.employee.type === 'superadmin') {
      return true;
    }

    if (this.auth.hasPermission(['superadmin', 'admin', 'organization.admin'])) {
      return true;
    }

    this.auth.goHome();
    return false;
  }
}
