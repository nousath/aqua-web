import { ShiftType } from './shift-type';
import { Device } from './device';
import { Organization } from './organization';
import { Supervisor } from './ems/employee';

// class Device {
//   id: 'string';
//   status: 'string'
// }
export class Employee {
  id = '';
  name = '';
  code = '';
  designation = '';
  status = '';
  picData = '';
  picUrl = '';
  email = '';
  password = '';
  phone = '';
  organization: Organization = new Organization();
  device: Device = new Device();
  shiftType: ShiftType = new ShiftType();
  leaveBalances: any[];
  avgHours: number = null;
  token = '';
  supervisor: Supervisor = new Supervisor();
  abilities: Abilities = new Abilities();
  currentAblitiy: 'maualAttendance' | 'manualByBeacon' | 'manualByGeoFencing' | 'manualByWifi' | 'none' = 'none';
  userType: 'admin' | 'superadmin' | 'normal' = 'normal';
  fingerPrints: string[] = [] ;
  devices: Device[] = [];
}


export class Abilities {
  maualAttendance = false;
  manualByBeacon = false;
  manualByGeoFencing = false;
  manualByWifi = false;
  shiftNotifier = false;
  trackLocation = false;
}


