import { LeaveType } from './leave-type';
export class LeaveBalance {
  id: string | number = null;
  approvedLeavesCount: number = null;
  daysAvailed: number = null;
  openingBalance: number = null;
  days: number = null;
  leaveType: LeaveType = new LeaveType();
}

export class OrgLeaveBalance {
  id: string = '';
  name: string = '';
  code: string = '';
  leaveBalances: LeaveBalance[] = [];
  isEdit: boolean = false;
}
