import { SharedModule } from '../../shared/shared.module';
import { NgModule } from '@angular/core';
import { AttendanceRoutingModule } from './attendances.routing';

import { AttendancesComponent } from './attendances.component';
import { MonthlyComponent } from './monthly/monthly.component';
import { DailyComponent } from './daily/daily.component';
import { AttendanceDetailsComponent } from './attendance-details/attendance-details.component';
import { ApplyLeaveComponent } from './apply-leave/apply-leave.component';
import { LeavesComponent } from './leaves/leaves.component';
import { LeaveBalancesComponent } from './leave-balances/leave-balances.component';
import { ManageLeavesComponent } from './manage-leaves/manage-leaves.component';
import { DayEventDialogComponent } from '../../dialogs/day-event-dialog/day-event-dialog.component';
import { LeaveActionDialogComponent } from '../../dialogs/leave-action-dialog/leave-action-dialog.component';

import { AttendanceLogsComponent } from './attendance-logs/attendance-logs.component';
import { ReportsComponent } from './reports/reports.component';
import { ReportFiltersComponent } from './report-filters/report-filters.component';
import { ReportListsComponent } from './report-lists/report-lists.component';
import { LeaveTypeComponent } from './leave-type/leave-type.component';
import { TeamsComponent } from './teams/teams.component';
import { ApplyLeaveTypeComponent } from './apply-leave-type/apply-leave-type.component';
import { RouterModule } from '@angular/router';
import { AddAttendanceLogsComponent } from '../../shared/components/add-attendance-logs/add-attendance-logs.component';

@NgModule({
  imports: [
    RouterModule,
    SharedModule,
    AttendanceRoutingModule
  ],
  declarations: [
    AttendancesComponent,
    MonthlyComponent,
    DailyComponent,
    AttendanceDetailsComponent,
    ApplyLeaveComponent,
    AttendanceLogsComponent,
    LeavesComponent,
    LeaveBalancesComponent,
    ManageLeavesComponent,
    DayEventDialogComponent,
    LeaveActionDialogComponent,
    ReportsComponent,
    ReportFiltersComponent,
    ReportListsComponent,
    LeaveTypeComponent,
    TeamsComponent,
    ApplyLeaveTypeComponent,
    AddAttendanceLogsComponent

  ],
  entryComponents: [
    DayEventDialogComponent,
    LeaveActionDialogComponent,
    AddAttendanceLogsComponent


  ],

  exports: [
    AttendancesComponent,
    MonthlyComponent,
    DailyComponent,
    AttendanceDetailsComponent,
    ApplyLeaveComponent,
    AttendanceLogsComponent,
    LeavesComponent,
    LeaveBalancesComponent,
    ManageLeavesComponent,
    AddAttendanceLogsComponent

  ]
})
export class AttendancesModule { }
