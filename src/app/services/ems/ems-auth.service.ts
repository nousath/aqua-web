import { Injectable } from '@angular/core';
import { IApi } from '../../common/contracts/api/api.interface';
import { Http } from '@angular/http';
import { GenericApi } from '../../common/generic-api';
import { Observable } from 'rxjs/Observable';
import { Employee } from '../../models';
import { LocalStorageService } from '../local-storage.service';
import { EmsEmployee } from '../../models/ems/employee';
import { User } from '../../models/user';
import { Subject } from 'rxjs/Subject';
import { Router } from '@angular/router';

@Injectable()
export class EmsAuthService {

  _currentUserSubject = new Subject<Employee>()

  currentUserChanges = this._currentUserSubject.asObservable();


  auth: IApi<any>;
  signup: IApi<any>;
  verify: IApi<any>;
  forgotPassword: IApi<any>;
  signin: IApi<any>;

  constructor(private http: Http,
    private store: LocalStorageService,
    private router: Router
  ) {
    const baseApi = 'ems';
    this.auth = new GenericApi<any>('users/signIn', http, baseApi);
    this.signin = new GenericApi<any>('users/signIn', http, baseApi);
    this.signup = new GenericApi<any>('authorizations/signUp', http, baseApi);
    this.verify = new GenericApi<any>('authorizations/verification', http, baseApi);
    this.forgotPassword = new GenericApi<any>('users/resend', http, baseApi);
  }

  private setRole(user: User) {
    const roles: any[] = user.roles;
    const role = roles.find(item => !!item.organization && !!item.employee); // TODO: need role selector
    this.store.setItem('roleKey', role.key);
    this.store.setItem('orgCode', role.organization.code);

    return role;
  }

  login(user: User): Observable<Employee> {

    const subject = new Subject<Employee>();
    (new GenericApi<User>('users', this.http, 'ems')).create(user, 'signIn').then((data: User) => {
      this.setRole(data);
      (new GenericApi<Employee>('employees', this.http, 'ams')).get('my').then(employee => {
        this.store.setObject('currentUser', employee);
        subject.next(employee)
        this._currentUserSubject.next(employee)
      }).catch(err => subject.error(err));
    }).catch(err => subject.error(err));

    return subject
  }

  loginUsingKey(key): Observable<Employee> {

    this.store.setItem('roleKey', key);
    const subject = new Subject<Employee>();

    (new GenericApi<User>('users', this.http, 'ems')).get('my').then((data: User) => {
      this.setRole(data);
      (new GenericApi<Employee>('employees', this.http, 'ams')).get('my').then(employee => {
        this.store.setObject('currentUser', employee);
        subject.next(employee);
        this._currentUserSubject.next(employee)
      }).catch(err => subject.error(err));
    }).catch(err => subject.error(err));

    return subject
  }

  resetPassword(id: string, otp: string, password: string): Observable<Employee> {
    const resetPassModel = {
      activationCode: otp,
      password: password
    };

    const subject = new Subject<Employee>();
    (new GenericApi<any>('users/setPassword', this.http, 'ems')).create(resetPassModel, `${id}`).then((data: User) => {
      this.setRole(data);
      (new GenericApi<Employee>('employees', this.http, 'ams')).get('my').then(employee => {
        this.store.setObject('currentUser', employee);
        subject.next(employee)
        this._currentUserSubject.next(employee)
      }).catch(err => subject.error(err));
    }).catch(err => subject.error(err));

    return subject
  }

  completeSignup(profileModel: EmsEmployee): Observable<Employee> {

    const subject = new Subject<Employee>();
    (new GenericApi<any>('authorizations/completeSignup', this.http, 'ems')).create(profileModel, profileModel.id).then((data: User) => {
      this.setRole(data);
      (new GenericApi<Employee>('employees', this.http, 'ams')).get('my').then(employee => {
        this.store.setObject('currentUser', employee);
        subject.next(employee)
        this._currentUserSubject.next(employee)
      }).catch(err => subject.error(err));
    }).catch(err => subject.error(err));

    return subject
  }

  logout(): Observable<Employee> {
    this.store.clear();
    this._currentUserSubject.next(null);
    this.router.navigate(['/login']);
    return this.currentUserChanges
  }

  goHome() {
    const employee = this.getCurrentUser();

    if (!employee) {
      return this.router.navigate(['/login']);
    }

    switch (employee.userType) {
      case 'superadmin':
        return this.router.navigate(['/attendances']);

      case 'admin':
        return this.router.navigate(['/attendances/daily', employee.id]);

      case 'normal':
        return this.router.navigate(['/home']);
    }
  }

  getCurrentUser(): Employee {
    return this.store.getObject('currentUser') as Employee;
  }

  getCurrentKey(): string {
    return this.store.getItem('roleKey');
  }
}
