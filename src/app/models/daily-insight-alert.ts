import { Holiday } from './holiday';
import { Organization } from './organization';
import { AlertType } from './alert-type';
import { DailyConfig } from './daily-config.model';
import { Processor } from './processor.model';
export class DailyInsightAlerts {
  id = '';
  status = '';
  organization: Organization = new Organization();
  config: DailyConfig = new DailyConfig();
  processor: Processor = new Processor();
  alertType: AlertType = new AlertType();
}



