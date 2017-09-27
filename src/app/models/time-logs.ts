import { Employee } from './employee';
export class TimeLogs {
  type: string;
  time: string;
  device: string;
  ipAddress: string;
  source: string;
  location: TimeLogsLocation = new TimeLogsLocation();
  employee: Employee = new Employee();
}

export class TimeLogsLocation {
  coordinates: number[] = [];
  has: boolean = false;
  show: boolean = false;
  address: string = '';
}
