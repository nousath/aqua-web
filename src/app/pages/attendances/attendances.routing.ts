import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AttendancesComponent } from './attendances.component';
import { MonthlyComponent } from './monthly/monthly.component';
import { DailyComponent } from './daily/daily.component';
import { AttendanceDetailsComponent } from './attendance-details/attendance-details.component';
import { ApplyLeaveComponent } from './apply-leave/apply-leave.component';
import { LeavesComponent } from './leaves/leaves.component';
import { LeaveBalancesComponent } from './leave-balances/leave-balances.component';
import { ManageLeavesComponent } from './manage-leaves/manage-leaves.component';
import { AttendanceLogsComponent } from './attendance-logs/attendance-logs.component';
import { ReportsComponent } from './reports/reports.component';
import { TeamsComponent } from './teams/teams.component';
import { AdminGuard } from '../../guards/admin.guard';
import { SubAdminGuard } from '../../guards/subadmin.gaurd';

const routes: Routes = [
  {
    path: '', component: AttendancesComponent, children: [
      { path: '', redirectTo: 'daily', pathMatch: 'full' },
      { path: 'monthly', component: MonthlyComponent },
      { path: 'daily', component: DailyComponent },
      { path: 'daily/report', component: ReportsComponent },

      { path: 'reports', component: ReportsComponent },

      { path: 'daily/:empId', component: AttendanceDetailsComponent },

      { path: 'teams/:empId', component: TeamsComponent },
      { path: 'daily/teams/:empId', component: TeamsComponent },
      { path: 'daily/teams/:empId', component: TeamsComponent },


      { path: 'monthly/:empId', component: AttendanceDetailsComponent },
      { path: 'leaves/:empId', component: AttendanceDetailsComponent },
      { path: 'daily/:empId/apply-leave', component: ApplyLeaveComponent },
      { path: 'daily/:empId/attendance-logs/:ofDate', component: AttendanceLogsComponent },
      { path: 'monthly/:empId/apply-leave', component: ApplyLeaveComponent },
      { path: 'leaves/:empId/apply-leave', component: ApplyLeaveComponent },
      { path: 'leaves/new/apply', component: ApplyLeaveComponent },

      { path: 'leaves', component: LeavesComponent },
      { path: 'leave-balances', component: LeaveBalancesComponent },
      { path: 'leave-balances/:empId', component: AttendanceDetailsComponent },
      { path: 'manage-leaves', component: ManageLeavesComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttendanceRoutingModule { }
