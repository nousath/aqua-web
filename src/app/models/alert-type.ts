import { Processor } from './processor.model';
import { Trigger } from './trigger.model';
export class AlertType {
  id = '';
  name = '';
  code = '';
  description = '';
  picUrl = '';
  cost: number = null;
  default = false;
  hasNotifications: boolean;
  processor: Processor = new Processor();
  trigger: Trigger = new Trigger();
  hasInsights: boolean;
  hasReports: boolean ;
}

