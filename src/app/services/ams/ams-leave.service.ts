import { Injectable } from '@angular/core';
import { IApi } from '../../common/contracts/api/api.interface';
import { GenericApi } from '../../common/generic-api';
import { Http } from '@angular/http';
import { Leave, LeaveBalance, OrgLeaveBalance, LeaveType } from '../../models';

@Injectable()
export class AmsLeaveService {

  leaves: IApi<Leave>;
  leaveTypes: IApi<LeaveType>;
  allLeavesOfOrg: IApi<Leave>;
  teamLeaves: IApi<Leave>;

  leaveBalances: IApi<LeaveBalance>;
  allLeaveBalances: IApi<OrgLeaveBalance>;
  updateLeaveBlances: IApi<LeaveBalance[]>;

  constructor(private http: Http) {
    const baseApi = 'ams';

    this.leaves = new GenericApi<Leave>('leaves', http, baseApi);
    this.allLeavesOfOrg = new GenericApi<Leave>('leaves/my/organization', http, baseApi);
    this.teamLeaves = new GenericApi<Leave>('leaves/my/teamLeaves', http, baseApi);
    this.leaveTypes = new GenericApi<LeaveType>('leaveTypes', http, baseApi);

    this.leaveBalances = new GenericApi<LeaveBalance>('leaveBalances', http, baseApi);
    this.allLeaveBalances = new GenericApi<OrgLeaveBalance>('leaveBalances/my/organization', http, baseApi);
    this.updateLeaveBlances = new GenericApi<LeaveBalance[]>('leaveBalances/multi', http, baseApi);
  }

}
