import { Injectable } from '@angular/core';
import { Router, Route } from '@angular/router';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { LocalStorageService } from '../services/local-storage.service';
import { EmsAuthService } from '../services';

@Injectable()
export class LoginGuard implements CanActivate {

  constructor(private auth: EmsAuthService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {

    if (!this.auth.getCurrentKey()) {
      return true
    }

    const currentUser = this.auth.currentEmployee();
    if (!currentUser) {
      return true
    }

    this.auth.goHome();
    return false
  }
}
