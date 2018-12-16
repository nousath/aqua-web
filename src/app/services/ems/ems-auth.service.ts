import { Injectable } from '@angular/core';
import { IApi } from '../../common/contracts/api/api.interface';
import { Http } from '@angular/http';
import { GenericApi } from '../../common/generic-api';
import { Observable } from 'rxjs/Observable';
import { Employee, Organization } from '../../models';
import { LocalStorageService } from '../local-storage.service';
import { EmsEmployee } from '../../models/ems/employee';
import { User } from '../../models/user';
import { Subject } from 'rxjs/Subject';
import { Router } from '@angular/router';
import { Role } from '../../models/ems/role';

@Injectable()
export class EmsAuthService {

  private _role: Role;
  private _user: User;

  private _roleSubject = new Subject<Role>();

  private _currentUserSubject = new Subject<User>()

  roleChanges = this._roleSubject.asObservable();

  userChanges = this._currentUserSubject.asObservable();

  private users: IApi<User>;
  private roles: IApi<Role>;
  // private organizations: IApi<Organization>;
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
    this.users = new GenericApi<any>('users', http, baseApi);
    this.roles = new GenericApi<Role>('roles', http, baseApi);
    // this.organizations = new GenericApi<Organization>('organizations', http, baseApi);

    this.auth = new GenericApi<any>('users/signIn', http, baseApi);
    this.signin = new GenericApi<any>('users/signIn', http, baseApi);
    this.signup = new GenericApi<any>('authorizations/signUp', http, baseApi);
    this.verify = new GenericApi<any>('authorizations/verification', http, baseApi);
    this.forgotPassword = new GenericApi<any>('users/resend', http, baseApi);
  }

  private _defaultRole(user: User): Role {
    // user.roles.length
    return user.roles.find((item) => !item.organization);
  }
  // user:any;
  private _extractRole(user: User): Role {
    let defaultRole = this._defaultRole(user);

    const roleKey = localStorage.getItem('role-key');

    if (!roleKey) {

      if (user.roles.length === 2) {
        user.roles.forEach(item => {
          if (!!item.organization) {
            defaultRole = item;
          }
        });
      }

      if (user.roles.length > 1) { // TODO: temporary hack
        return user.roles.find(item => !!item.organization && !!item.employee);
      }

      return defaultRole;
    }

    return user.roles.find(item => item.key === roleKey);

    // if (!role) {
    //   localStorage.removeItem('role-key');
    // } else {
    //   localStorage.setItem('role-key', role.key);
    // }
    // return role;
  }

  private _setRole(role: Role) {
    this._role = role;
    if (role) {
      this.store.setItem('role-key', role.key);
      // this.store.setItem('roleKey', role.key); // obsolete

    } else {
      this.store.removeItem('role-key');
      // this.store.removeItem('roleKey'); // obsolete
    }
    this._roleSubject.next(this._role);
    return role;
  }

  private _setUser(user: User) {
    this._user = user;
    this.store.setObject('user', this._user);

    const role = this._extractRole(user);
    this._setRole(role);
    // this._currentUserSubject.next(this._user);
    return user;
  }

  private setRole(user: User) {
    const roles: any[] = user.roles;
    const role = roles.find(item => !!item.organization && !!item.employee); // TODO: need role selector
    this.store.setItem('roleKey', role.key);
    this.store.setItem('orgCode', role.organization.code);
    this.store.setObject('currentRole', role);

    return role;
  }

  newUser(user: User) {
    this._currentUserSubject.next(user);
  }

  login(email: string, password: string): Observable<Role> {
    const subject = new Subject<Role>();
    this.users.simplePost({
      email: email,
      password: password
    }, 'signIn').then((data: User) => {
      this._setUser(new User(data));
      const role = this.currentRole();
      subject.next(role);
    }).catch(err => subject.error(err));
    return subject
  }

  setPassword(email: string, otp: string, password: string): Observable<Role> {
    const subject = new Subject<Role>();
    this.users.simplePost({
      email: email,
      activationCode: otp,
      password: password
    }, 'setPassword').then((data: User) => {
      this._setUser(new User(data));
      const role = this.currentRole();
      subject.next(role);
    }).catch(err => subject.error(err));

    return subject
  }

  sendOTP(email: string): Observable<User> {
    const subject = new Subject<User>();
    this.users.simplePost({
      email: email
    }).then(data => {
      this._setUser(new User(data));
      subject.next(data);
    }).catch(err => subject.error(err));
    return subject
  }

  // verifyOTP(email: string, otp: string): Observable<User> {
  //   const subject = new Subject<User>();
  //   this.users.simplePost({
  //     email: email,
  //     activationCode: otp
  //   }).then((data: User) => {
  //     const user = new User(data)
  //     this._setUser(user);
  //     subject.next(user)
  //   }).catch(err => subject.error(err));

  //   return subject
  // }

  loginUsingKey(key): Observable<Role> {

    this.store.setItem('roleKey', key);
    const subject = new Subject<Role>();

    (new GenericApi<User>('users', this.http, 'ems')).get('my').then((data: User) => {
      this._setUser(new User(data));
      const role = this.currentRole();
      subject.next(role);
    }).catch(err => subject.error(err));

    return subject
  }


  join(employee: EmsEmployee, organization: Organization): Observable<Role> {

    const subject = new Subject<Role>();
    const role = new Role();
    if (!organization.id) {
      employee.type = 'superadmin'
    }
    role.organization = organization;
    role.employee = employee;

    this.roles.create(role).then(newRole => {
      const user = this.currentUser();
      user.roles.push(newRole);
      this._user = user;
      this.store.setObject('user', this._user);
      this._setRole(newRole);
      subject.next(newRole);
    }).catch(err => subject.error(err));

    return subject.asObservable()
  }
  // completeSignup(profileModel: EmsEmployee): Observable<Employee> {

  //   const subject = new Subject<Employee>();
  //   (new GenericApi<any>('authorizations/completeSignup', this.http, 'ems')).create(profileModel, profileModel.id).then((data: User) => {
  //     this._setUser(new User(data));

  //     (new GenericApi<Employee>('employees', this.http, 'ams')).get('my').then(employee => {
  //       this.store.setObject('employee', employee);
  //       subject.next(employee)
  //       this._currentUserSubject.next(employee)
  //     }).catch(err => subject.error(err));
  //   }).catch(err => subject.error(err));

  //   return subject
  // }

  logout(): Observable<User> {
    this.store.clear();
    this._role = null;
    this._user = null;
    this._currentUserSubject.next(null);
    this._roleSubject.next(null);
    this.router.navigate(['/login']);
    return this.userChanges
  }

  goHome() {
    const role = this.currentRole();

    if (!role || !role.employee) {
      return this.router.navigate(['/login']);
    }

    switch (role.employee.type) {
      case 'superadmin':
        const setup = this.store.getItem('setup')
        if (setup) {
          this.goToSetup(setup);
        } else {
          this.router.navigate(['/attendances']);
        }
        break
      case 'admin':
        this.router.navigate(['/home/team']);
        break;
      case 'normal':
        this.router.navigate(['/home']);
        break;
    }
  }

  goToSetup(step) {
    switch (step) {
      case 'employees':
        this.router.navigate(['/wizard/devices']);
        break;
      case 'devices':
        this.router.navigate(['/wizard/syncapp']);
        break;
      case 'syncapp':
        this.router.navigate(['/wizard/alerts']);
        break;
      case 'alerts':
        this.router.navigate(['/wizard/complete']);
        break;
      case 'complete':
        this.store.removeItem('setup')
        this.router.navigate(['/attendances']);
        break;
      default:
        this.router.navigate(['/pages']);
        break;
    }
  }


  refreshUser() {
    const currentUser = this.currentUser();
    if (currentUser) {

      const defaultRole = this._defaultRole(currentUser);
      const headers = [{
        key: 'x-role-key',
        value: defaultRole.key
      }];
      const api = new GenericApi<User>('users', this.http, 'ems', headers);

      api.get('my').then(data => {
        this._setUser(new User(data));
      });
    }
  }

  currentRole(): Role {
    if (this._role) {
      return this._role;
    }

    const user = this.currentUser();

    if (!user) {
      return null;
    }

    const role = this._extractRole(user);
    return this._setRole(role);
  }

  currentUser(): User {
    if (this._user) {
      return this._user;
    }

    const savedUser = localStorage.getItem('user');

    let user: User = null;

    if (savedUser) {
      user = this._setUser(new User(JSON.parse(savedUser)));
    }

    return user;
  }



  // currentEmployee(): Employee {
  //   return this.store.getObject('employee') as Employee;
  // }

  getCurrentKey(): string {
    return this.store.getItem('role-key');
  }

  // getCurrentRole(): Role {
  //   return this.store.getObject('currentRole') as Role;
  // }

  hasPermission(permission: string): Boolean {
    const currentRole = this.currentRole();

    if (!currentRole) { return false; }

    if (!currentRole.permissions.length) { return false; }

    const value = currentRole.permissions.find(item => item.toLowerCase() === permission.toLowerCase())

    return !!value;
  }
}
