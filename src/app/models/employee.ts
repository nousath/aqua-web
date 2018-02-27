import { ShiftType } from './shift-type';
import { Device } from './device';
import { Organization } from './organization';
import { Supervisor } from './ems/supervisor.model';
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
}

// export class EffectiveShift {
//   date: Date = null;
//   shiftType: string = '';//shiftTypeId
// }

export class Abilities {
  maualAttendance = false;
  manualByBeacon = false;
  manualByGeoFencing = false;
  manualByWifi = false;
  shiftNotifier = false;
  trackLocation = false;
}


