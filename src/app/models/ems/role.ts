import { EmsEmployee, Organization } from '..';

export class Role {
  id: string;
  code: string;
  key: string;

  status: string;
  timeStamp: Date;
  employee?: EmsEmployee;
  organization?: Organization;
  permissions: string[] = [];

  constructor(obj?: any) {

    if (!obj) {
      return;
    }

    this.id = obj.id;
    this.key = obj.key;
    this.status = obj.status;
    this.timeStamp = obj.timeStamp;

    if (obj.employee) {
      this.employee = new EmsEmployee(obj.employee);
    }



    if (obj.organization) {
      this.organization = new Organization(obj.organization);
    }

    this.permissions = [];
    if (obj.permissions) {
      obj.permissions.forEach(permission => {
        this.permissions.push(permission);
      });
    }
  }

}
