import { Employee } from './employee';
import { LeaveType } from './leave-type';
export class Leave {
  date: string = null;
  toDate: string = null;
  days: number = null;
  id: string | number = null;
  employee: Employee = new Employee();
  reason: string = '';
  comment: string = '';
  status: string = '';
  leaveType: LeaveType = new LeaveType();
  type: LeaveType = new LeaveType();
}
