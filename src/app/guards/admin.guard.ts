import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { EmsAuthService } from '../services/ems/ems-auth.service';

@Injectable()
export class AdminGuard implements CanActivate {

  constructor(private auth: EmsAuthService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {

    const role = this.auth.currentRole();
    if (!role || !role.employee) {
      this.auth.goHome();
      return false
    }

    if (role.employee.type === 'superadmin' || role.employee.type === 'admin') {
      return true;
    }

    this.auth.goHome();
    return false;
  }
}
