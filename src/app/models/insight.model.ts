
import { DailyInsightAlerts } from './daily-insight-alert';
import { Organization } from './organization';
import { AlertType } from './alert-type';
import { AlertConfig } from './alert-config';

export class Insight {
  id = '';
  status = '';
  date = '';
  organization: Organization = new Organization();
  alertType: AlertType = new AlertType();
  config: AlertConfig = new AlertConfig();

}



