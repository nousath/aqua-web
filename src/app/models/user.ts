import { Organization } from './organization';

export class User {
  id: string = null;
  email = '';
  password = '';
  name = '';
  token = '';
  code = '';
  status = '';
  phone = '';
  organization: Organization = new Organization()
}
