import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { EmsAuthService } from '../services';
declare var ga: any;

@Injectable()
export class UserGuard implements CanActivate {

  constructor(private auth: EmsAuthService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {

    if (!this.auth.getCurrentKey()) {
      this.auth.goHome();
      return false
    }

    const currentUser = this.auth.getCurrentUser();
    if (!currentUser) {
      this.auth.goHome();
      return false
    }

    // if (user) {
    //   ga('set', '&uid', `${user.name} ${user.email}`)
    // }
    return true;
  }
}
