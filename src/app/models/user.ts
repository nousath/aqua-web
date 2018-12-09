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
  roles: Role[];
  organization: Organization = new Organization()
}
