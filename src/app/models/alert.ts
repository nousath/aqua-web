import { AlertType, AlertConfig } from './alert-type';
import { Organization } from './organization';
export class AmsAlert {
  id: string = '';
  status: string = '';
  alertType: AlertType = new AlertType();
  config: AlertConfig = new AlertConfig();
  organization: Organization = new Organization();
}

export class AlertParameter {
  id: string = '';
  name: string = '';
  value: number | string = null;
  title: string = '';
  type: string = '';
  description: string = '';
  expectedValues: string[] = [];
}
