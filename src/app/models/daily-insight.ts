import { AmsAlert } from './alert';
import { DailyInsightAlerts } from './daily-insight-alert';
import { AlertConfig } from './alert-config';
export class DailyInsight {
  employee = '';
  alert: AmsAlert = new AmsAlert();
 
  config: AlertConfig = new AlertConfig();
  date = '';
  onHome: false;

}

