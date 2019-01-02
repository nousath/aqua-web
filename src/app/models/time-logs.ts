import { Employee } from './employee';
export class TimeLogs {
  type: string;
  time: Date;
  device: string;
  ipAddress: string;
  source: string;
  isComputed: boolean;
  location: TimeLogsLocation = new TimeLogsLocation();
  employee: Employee = new Employee();
}

export class TimeLogsLocation {
  coordinates: number[] = [];
  has = false;
  show = false;
  address = '';
}
