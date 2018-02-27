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
  id = '';
  name = '';
  code = '';
  leaveBalances: LeaveBalance[] = [];
  isEdit = false;
}
