import { Organization } from '../organization';
import { Device } from '../device';
import { ShiftType } from '../shift-type';

export class EmsEmployee {
  id = '';
  name = '';
  code = '';
  displayCode: string;
  aadhaar = '';
  pan = '';

  // designation = new Designation();
  designationId: any;
  // department = new Department();
  departmentId: number;
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
  employmentType: string;
  leaveBalances: any[];
  avgHours: number = null;
  token = '';

  accountNo = '';
  accountHolder = '';
  ifsc = '';
  bank = '';
  branch = '';

  address1 = '';
  address2 = '';
  city = '';
  state = '';
  district = '';
  pincode = '';

  dom = '';
  contractor = '';

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





