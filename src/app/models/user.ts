import { Organization } from './organization';

export class User {
  id: number = null;
  email: string = '';
  password: string = '';
  name: string = '';
  token: string = '';
  code: string = '';
  status: string = '';
  phone: string = '';
  organization: Organization = new Organization()
}
