import { Employee } from './employee';
import { Device } from '.';
import { ModelBase } from '../common/contracts/base.model';
export class TimeLogs extends ModelBase {
  type: string;
  time: Date;
  device: Device;
  ipAddress: string;
  source: string;
  isComputed: boolean;
  ignore: boolean;
  location: TimeLogsLocation = new TimeLogsLocation();
  employee: Employee = new Employee();
}

export class TimeLogsLocation {
  coordinates: number[] = [];
  has = false;
  show = false;
  address = '';
}
