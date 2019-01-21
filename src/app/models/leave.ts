import { Employee } from './employee';
import { LeaveType } from './leave-type';
import { ModelBase } from '../common/contracts/base.model';
export class Leave extends ModelBase {
  date: Date;
  start: {
    first: boolean,
    second: boolean
  };

  toDate: Date;
  end: {
    first: boolean,
    second: boolean
  };

  units: number;
  days: number;
  employee: Employee;

  leaveType: LeaveType;
  reason: string;
  comment: string;
  status: any;
}
