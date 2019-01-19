import { Device } from './device';
import { Employee } from './employee';
import { Organization } from './organization';
export class DeviceLogs {
  id: string | number = null;
  status: string;
  message: string;
  date: string;
  deviceName: string;
  ipAddress: string;
  location: string;
}

export class Log {
  id: string | number = null;
  level: string;
  message: string;
  meta: Object;

  timeStamp: string;

  device: Device;
  employee: Employee;
  user: Employee;
  organization: Organization;

  app: string;
  location: string;
}
