import { Organization } from '../organization';
import { Device } from '../device';
import { ShiftType } from '../shift-type';
import { Designation } from '../designation';

export class EmsEmployee {
  id = '';
  name = '';
  code = '';
  // designation: Designation = new Designation();
  designation = '';
  departmentId = '';
  status = '';
  gender: 'male' | 'female' | 'others' | null = null;
  fatherName = '';
  bloodGroup: 'A+' | 'B+' | 'O+' | 'AB+' | 'A-' | 'B-' | 'O-' | 'AB-' | null = null;
  picData = '';
  picUrl = '';
  dob = '';
  doj = '';
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
  dol = '';
  reason = '';
}

export class Supervisor {
  id: number = null;
  code = '';
  name = '';
  designation: string;
  supervisor: Supervisor;
}





