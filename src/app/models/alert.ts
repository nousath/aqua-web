import { AlertType } from './alert-type';
import { Organization } from './organization';
import { AlertConfig } from './alert-config';
export class AmsAlert {
  id = '';
  status = '';
  alertType: AlertType = new AlertType();
  config: AlertConfig = new AlertConfig();
  organization: Organization = new Organization();
}


