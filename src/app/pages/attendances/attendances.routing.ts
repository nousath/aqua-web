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
import { TeamsComponent } from './teams/teams.component';


const routes: Routes = [
  {
    path: '', component: AttendancesComponent, children: [
      { path: '', redirectTo: 'daily', pathMatch: 'full' },
      { path: 'monthly', component: MonthlyComponent },
      { path: 'daily', component: DailyComponent },

      { path: 'daily/:empId', component: AttendanceDetailsComponent },
      { path: 'monthly/:empId', component: AttendanceDetailsComponent },
      { path: 'leaves/:empId', component: AttendanceDetailsComponent },
      { path: 'leave-balances/:empId', component: AttendanceDetailsComponent },

      { path: 'teams/:empId', component: TeamsComponent },
      { path: 'daily/teams/:empId', component: TeamsComponent },
      { path: 'daily/teams/:empId', component: TeamsComponent },

      { path: 'daily/:empId/apply-leave', component: ApplyLeaveComponent },
      { path: 'monthly/:empId/apply-leave', component: ApplyLeaveComponent },
      { path: 'leaves/:empId/apply-leave', component: ApplyLeaveComponent },
      { path: 'leaves/new/apply', component: ApplyLeaveComponent },

      { path: 'leaves', component: LeavesComponent },
      { path: 'leave-balances', component: LeaveBalancesComponent },
      { path: 'manage-leaves', component: ManageLeavesComponent },
      { path: ':empId/logs', component: AttendanceLogsComponent }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttendanceRoutingModule { }
