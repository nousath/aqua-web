import { Injectable } from '@angular/core';
import { Router, Route } from '@angular/router';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { LocalStorageService } from '../services/local-storage.service';

@Injectable()
export class LoginGuard implements CanActivate {

  constructor(private router: Router, private store: LocalStorageService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {

    const orgCode = route.queryParams['org-code'];
    let roleKey = route.queryParams['role-key'];
    if (orgCode && roleKey) {
      this.store.clear();
    }
    roleKey = this.store.getItem('roleKey');
    if (roleKey) {
      this.router.navigate(['/pages']);
      return false;
    }
    return true;
  }
}
