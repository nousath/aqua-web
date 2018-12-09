import { Organization } from '../organization';
import { Device } from '../device';
import { ShiftType } from '../shift-type';
import { Designation } from '../designation';
import { Department } from '../department';
import { Doc } from '../doc.model';
import { Role } from './role';



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
  line1 = '';
  line2 = '';
  city = '';
  state = '';
  district = '';
  pinCode = '';
}


export class CustomFields {
  dom: Date;
  biometricId: string;
  contractor: string;
  employmentType: string;
  accountNo: string;
  accountHolder: string;
  ifsc: string;
  bank: string;
  branch: string;

  aadhaar: string;
  pan: string;
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
  designation: Designation;
  department: Department;
  organization: Organization = new Organization();

  role: Role;

  password = '';
  type: 'admin' | 'superadmin' | 'normal' = 'normal';

  // device: Device = new Device();
  // shiftType: ShiftType = new ShiftType();
  // leaveBalances: any[];
  // avgHours: number = null;



  // displayCode: string;


  doj: Date;
  dol: Date;
  reason = '';
  config: CustomFields;

  constructor() {
    this.profile = this.profile || new Profile();
    // this.designation = this.designation || new Designation();
    // this.department = this.department || new Department();
    this.address = this.address || new Address();
    this.config = this.config || new CustomFields();
  }
}






