import { Injectable } from '@angular/core';
import { Router, Route } from '@angular/router';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { LocalStorageService } from '../services/local-storage.service';

@Injectable()
export class LoginGuard implements CanActivate {

  constructor(private router: Router, private store: LocalStorageService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {

    const orgcode = route.queryParams['org_code'];
    const externalToken = route.queryParams['user_access_token'];
    if (orgcode && externalToken) {
      this.store.clear();
    }
    const amstoken: string = this.store.getItem('ams_token');
    if (amstoken) {
      this.router.navigate(['/pages']);
      return false;
    }
    return true;
  }
}
