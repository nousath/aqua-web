import { Organization } from '../organization';
import { Device } from '../device';
import { ShiftType } from '../shift-type';
import { Designation } from '../designation';
import { Department } from '../department';
import { Contractor } from '../contractor';
import { Doc } from '../doc.model';
import { Role } from './role';



export class Profile {
  dob: Date;
  firstName: string;
  lastName: string;
  gender: 'male' | 'female' | 'others' | null = null;
  fatherName = '';
  bloodGroup: 'A+' | 'B+' | 'O+' | 'AB+' | 'A-' | 'B-' | 'O-' | 'AB-' | null = null;

  pic: Doc = new Doc();

  constructor(obj?: any) {

    if (!obj) {
      return;
    }
    this.firstName = obj.firstName;
    this.lastName = obj.lastName;

    if (obj.pic) {
      this.pic = new Doc(obj.pic)
    }

    this.dob = obj.dob;
    this.fatherName = obj.fatherName;
    this.bloodGroup = obj.bloodGroup;
    this.gender = obj.gender;

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
  contractor: Contractor;
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
  timeStamp: Date;

  status = '';
  email = '';
  phone = '';

  profile: Profile = new Profile();
  address: Address = new Address();

  supervisor: EmsEmployee;
  designation: Designation;
  department: Department;
  organization: Organization = new Organization();

  role: Role;

  type: 'admin' | 'superadmin' | 'normal';

  // device: Device = new Device();
  // shiftType: ShiftType = new ShiftType();
  // leaveBalances: any[];
  // avgHours: number = null;



  // displayCode: string;


  doj: Date;
  dol: Date;
  reason = '';
  config: CustomFields = new CustomFields();

  // constructor() {
  //   this.profile = this.profile || new Profile();
  //   // this.designation = this.designation || new Designation();
  //   // this.department = this.department || new Department();
  //   this.address = this.address || new Address();
  //   this.config = this.config || new CustomFields();
  // }

  constructor(obj?: any) {
    if (!obj) {
      return;
    }

    this.id = obj.id;
    this.code = obj.code;

    this.profile = this.profile || new Profile();
    // this.designation = this.designation || new Designation();
    // this.department = this.department || new Department();
    this.address = this.address || new Address();
    this.config = this.config || new CustomFields();


    this.designation = new Designation(obj.designation);
    this.department = new Department(obj.department);
    // this.division = new Division(obj.division);
    this.status = obj.status;
    this.type = obj.type;
    this.timeStamp = obj.timeStamp;
    this.profile = new Profile(obj.profile);

  }
}






