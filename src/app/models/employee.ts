import { ShiftType } from './shift-type';
import { Device } from './device';
import { Organization } from './organization';

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
  displayCode = '';
  organization: Organization = new Organization();
  device: Device = new Device();
  shiftType: ShiftType = new ShiftType();
  leaveBalances: any[];
  avgHours: number = null;
  token = '';
  supervisor: any;
  abilities: Abilities = new Abilities();
  currentAblitiy: 'maualAttendance' | 'manualByBeacon' | 'manualByGeoFencing' | 'manualByWifi' | 'none' = 'none';
  userType: 'admin' | 'superadmin' | 'normal' = 'normal';
  fingerPrints: string[] = [];
  devices: Device[] = [];
  isDynamicShift: boolean;
  hasTeam: Boolean;
  weeklyOff: {
    monday: Boolean,
    tuesday: Boolean,
    wednesday: Boolean,
    thursday: Boolean,
    friday: Boolean,
    saturday: Boolean,
    sunday: Boolean,
    isConfigured: Boolean
  };
}


export class Abilities {
  maualAttendance = false;
  manualByBeacon = false;
  manualByGeoFencing = false;
  manualByWifi = false;
  shiftNotifier = false;
  trackLocation = false;
}


