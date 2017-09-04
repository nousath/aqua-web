import { Injectable } from '@angular/core';
import { Router, Route } from '@angular/router';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { LocalStorageService } from '../services/local-storage.service';

@Injectable()
export class UserGuard implements CanActivate {

  constructor(private router: Router, private store: LocalStorageService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    // let user: User = this.store.getObject('user') as User;
    let amstoken: string = this.store.getItem('ams_token');
    let orgCode: string = this.store.getItem('orgCode');
    if (!amstoken || !orgCode) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
