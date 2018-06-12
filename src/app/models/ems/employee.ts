import { Organization } from '../organization';
import { Device } from '../device';
import { ShiftType } from '../shift-type';
import { Designation } from '../designation';

export class EmsEmployee {
  id: string = '';
  name: string = '';
  code: string = '';
  // designation: Designation = new Designation();
  designation: string = '';
  departmentId = '';
  status: string = '';
  gender: 'male' | 'female' | 'others' | null = null;
  fatherName: string = '';
  bloodGroup: 'A+' | 'B+' | 'O+' | 'AB+' | 'A-' | 'B-' | 'O-' | 'AB-' | null = null;
  picData: string = '';
  picUrl: string = '';
  dob: string = '';
  doj: string = '';
  email: string = '';
  password: string = '';
  userType: 'admin' | 'superadmin' | 'normal' = 'normal';
  phone: string = '';
  organization: Organization = new Organization();
  device: Device = new Device();
  shiftType: ShiftType = new ShiftType();
  supervisor: Supervisor = new Supervisor();
  leaveBalances: any[];
  avgHours: number = null;
  token: string = '';

  address1: string = '';
  address2: string = '';
  city: string = '';
  state: string = '';
  district: string = '';
  pincode: string = '';
  dol: string = '';
  reason: string = '';
}

export class Supervisor {
  id: number = null;
  code: string = '';
  name: string = '';
  designation: string;
  supervisor: Supervisor;
}





