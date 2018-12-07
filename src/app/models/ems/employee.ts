import { Organization } from '../organization';
import { Device } from '../device';
import { ShiftType } from '../shift-type';
import { Designation } from '../designation';
import { Department } from '../department';


export class Doc {
  id: string;
  url: string;
  thumbnail: string;
}
export class Profile {
  dob: Date;
  firstName: string;
  lastName: string;
  gender: 'male' | 'female' | 'others' | null = null;
  fatherName = '';
  bloodGroup: 'A+' | 'B+' | 'O+' | 'AB+' | 'A-' | 'B-' | 'O-' | 'AB-' | null = null;

  pic: Doc;

  constructor() {
    this.pic = new Doc();
  }
}

export class Address {
  address1 = '';
  address2 = '';
  city = '';
  state = '';
  district = '';
  pincode = '';
}

export class Role {
  id: string;
  key: string;
  permissions: string[];
}

export class CustomFields {
  dom: Date;
  biometricId: string;
  contractor: string;
  employmentType: string;
}
export class EmsEmployee {
  id = '';
  code = '';

  status = '';
  email = '';
  phone = '';

  profile: Profile;
  address: Address;

  supervisor: EmsEmployee;
  designation = new Designation();
  department = new Department();
  organization: Organization = new Organization();

  role: Role;

  password = '';
  type: 'admin' | 'superadmin' | 'normal' = 'normal';

  // device: Device = new Device();
  // shiftType: ShiftType = new ShiftType();
  // leaveBalances: any[];
  // avgHours: number = null;

  accountNo = '';
  accountHolder = '';
  ifsc = '';
  bank = '';
  branch = '';

  // displayCode: string;
  aadhaar = '';
  pan = '';

  doj: Date;
  dol: Date;
  reason = '';
  custom: CustomFields;

  constructor() {
    this.profile = this.profile || new Profile();
    this.designation = this.designation || new Designation();
    this.department = this.department || new Department();
    this.address = this.address || new Address();
    this.custom = this.custom || new CustomFields();
  }
}






