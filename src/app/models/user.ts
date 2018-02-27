import { Organization } from './organization';

export class User {
  id: number = null;
  email = '';
  password = '';
  name = '';
  token = '';
  code = '';
  status = '';
  phone = '';
  organization: Organization = new Organization()
}
