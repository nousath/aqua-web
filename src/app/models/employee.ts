import { ShiftType } from './shift-type';
import { Device } from './device';
import { Organization } from './organization';
import { Supervisor } from './ems/employee';

// class Device {
//   id: 'string';
//   status: 'string'
// }
export class Employee {
  id: string = '';
  name: string = '';
  code: string = '';
  designation: string = '';
  status: string = '';
  picData: string = '';
  picUrl: string = '';
  email: string = '';
  password: string = '';
  phone: string = '';
  organization: Organization = new Organization();
  device: Device = new Device();
  shiftType: ShiftType = new ShiftType();
  leaveBalances: any[];
  avgHours: number = null;
  token: string = '';
  supervisor: Supervisor = new Supervisor();
  abilities: Abilities = new Abilities();
  currentAblitiy: 'maualAttendance' | 'manualByBeacon' | 'manualByGeoFencing' | 'manualByWifi' | 'none' = 'none';
  userType: 'admin' | 'superadmin' | 'normal' = 'normal';
  fingerPrints : string[] = [] ;
  devices: Device[] = [];
}


export class Abilities {
  maualAttendance: boolean = false;
  manualByBeacon: boolean = false;
  manualByGeoFencing: boolean = false;
  manualByWifi: boolean = false;
  shiftNotifier: boolean = false;
  trackLocation: boolean = false;
}


