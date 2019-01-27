import { LeaveType } from './leave-type';
import { ModelBase } from '../common/contracts/base.model';
export class LeaveBalance extends ModelBase {
  approvedLeavesCount: number = null;
  daysAvailed: number = null;
  openingBalance: number = null;
  days: number = null;
  leaveType: LeaveType = new LeaveType();
  journals: BalanceJournal[];
}

export class BalanceJournal {
  date: Date;
  units: number;
  entity: {
    id: string,
    type: string
  };
  meta: Object;
  comment: string;
}


export class OrgLeaveBalance {
  id = '';
  name = '';
  code = '';
  leaveBalances: LeaveBalance[] = [];
  isEdit = false;
}
