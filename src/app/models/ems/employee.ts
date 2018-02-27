import { Organization } from '../organization';
import { Device } from '../device';
import { ShiftType } from '../shift-type';
import { Designation } from '../designation';
import { Supervisor } from './supervisor.model';

export class EmsEmployee {
  id = '';
  name = '';
  code = '';
  // designation: Designation = new Designation();
  designation = '';
  status = '';
  gender: 'male' | 'female' | 'others' | null = null;
  fatherName = '';
  bloodGroup: 'A+' | 'B+' | 'O+' | 'AB+' | 'A-' | 'B-' | 'O-' | 'AB-' | null = null;
  picData = '';
  picUrl = '';
  dob = '';
  email = '';
  password = '';
  userType: 'admin' | 'superadmin' | 'normal' = 'normal';
  phone = '';
  organization: Organization = new Organization();
  device: Device = new Device();
  shiftType: ShiftType = new ShiftType();
  supervisor: Supervisor = new Supervisor();
  leaveBalances: any[];
  avgHours: number = null;
  token = '';

  address1 = '';
  address2 = '';
  city = '';
  state = '';
  district = '';
  pincode = '';
}
