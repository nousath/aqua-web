import { DailyParameter } from './daily-parameter.model';
import { AlertParameter } from './alert-parameter.model';

export class Trigger {
  dailyParameter: DailyParameter[];
  parameters: AlertParameter[] = []
}
