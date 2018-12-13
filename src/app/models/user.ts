import { Organization } from './organization';
import { Role } from './ems/role';

export class User {
  id: string = null;
  email = '';
  password = '';
  name = '';
  token = '';
  code = '';
  status = '';
  phone = '';

  mobile: string;
  roles: Role[];
  timeStamp: Date;
  organization: Organization = new Organization();

  constructor(obj?: any) {
    if (!obj) {
      return;
    }

    this.id = obj.id;
    this.timeStamp = obj.timeStamp;

    this.name = obj.name;
    this.email = obj.email;
    this.mobile = obj.phone;
    this.roles = [];

    if (obj.roles) {
      obj.roles.forEach(item => {
        this.roles.push(new Role(item));
      });
    }
  }
}
