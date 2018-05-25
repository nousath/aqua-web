import { Organization } from './organization';

export class User {
  id: string = null;
  email: string = '';
  password: string = '';
  name: string = '';
  token: string = '';
  code: string = '';
  status: string = '';
  phone: string = '';
  organization: Organization = new Organization()
}
