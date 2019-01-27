import { Injectable } from '@angular/core';
import { IApi } from '../../common/ng-api/api.interface';
import { GenericApi } from '../../common/ng-api/generic-api';
import { Http } from '@angular/http';
import { Leave, LeaveBalance, OrgLeaveBalance, LeaveType } from '../../models';
import * as moment from 'moment';
import { DatesService } from '../../shared/services/dates.service';

export class LeaveSummary {
  first = false;
  second = false;
  code = '';
  days = 0;
  status = '';
  reason = '';
  leave: Leave;
}

@Injectable()
export class AmsLeaveService {

  leaves: IApi<Leave>;
  leaveTypes: IApi<LeaveType>;
  allLeavesOfOrg: IApi<Leave>;
  teamLeaves: IApi<Leave>;

  leaveBalances: IApi<LeaveBalance>;
  allLeaveBalances: IApi<OrgLeaveBalance>;
  updateLeaveBlances: IApi<LeaveBalance[]>;

  constructor(
    private http: Http,
    private dates: DatesService
  ) {
    const baseApi = 'ams';

    this.leaves = new GenericApi<Leave>('leaves', http, baseApi);
    this.allLeavesOfOrg = new GenericApi<Leave>('leaves/my/organization', http, baseApi);
    this.teamLeaves = new GenericApi<Leave>('leaves/my/teamLeaves', http, baseApi);
    this.leaveTypes = new GenericApi<LeaveType>('leaveTypes', http, baseApi);

    this.leaveBalances = new GenericApi<LeaveBalance>('leaveBalances', http, baseApi);
    this.allLeaveBalances = new GenericApi<OrgLeaveBalance>('leaveBalances', http, baseApi);
    this.updateLeaveBlances = new GenericApi<LeaveBalance[]>('leaveBalances/multi', http, baseApi);
  }

  getDaySummary = (leaves: Leave[], date: Date): LeaveSummary => {
    const leaveSummary = new LeaveSummary()

    if (!leaves || !leaves.length) {
      return leaveSummary
    }

    leaves.forEach(leave => {
      if (leave.status === 'rejected' || leave.status === 'cancelled') {
        return;
      }

      const onLeave = (!leave.toDate && this.dates.date(date).isSame(leave.date)) ||
        (leave.toDate && this.dates.date(date).isBetween(leave.date, leave.toDate))
      if (onLeave) {
        if (this.dates.date(date).isSame(leave.date) && leave.start && leave.start.first !== undefined) {
          leaveSummary.first = leave.start.first
          leaveSummary.second = leave.start.second
        } else if (this.dates.date(date).isSame(leave.toDate) && leave.end && leave.end.first !== undefined) {
          leaveSummary.first = leave.end.first
          leaveSummary.second = leave.end.second
        } else {
          leaveSummary.first = true
          leaveSummary.second = true
        }
        leaveSummary.code = leave.leaveType.code
        leaveSummary.days = leave.days
        leaveSummary.reason = leave.reason
        leaveSummary.leave = leave
      }
    })
    return leaveSummary
  }

}
