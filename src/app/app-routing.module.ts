import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { PagesComponent } from './pages/pages.component';
import { LoginGuard, UserGuard } from './guards';
import { EmployeesComponent } from './pages/employees/employees.component';
import { OrgLoginComponent } from './pages/org-login/org-login.component';
import { EmployeeListComponent } from './pages/employees/employee-list/employee-list.component';
import { EmpEditComponent } from './pages/employees/emp-edit/emp-edit.component';
import { MonthlyComponent } from './pages/attendances/monthly/monthly.component';
import { AttendanceDetailsComponent } from './pages/attendances/attendance-details/attendance-details.component';
import { AttendancesComponent } from './pages/attendances/attendances.component';
import { DailyComponent } from './pages/attendances/daily/daily.component';
import { LeavesComponent } from './pages/attendances/leaves/leaves.component';
import { LeaveBalancesComponent } from './pages/attendances/leave-balances/leave-balances.component';
import { ManageLeavesComponent } from './pages/attendances/manage-leaves/manage-leaves.component';
import { ApplyLeaveComponent } from './pages/attendances/apply-leave/apply-leave.component';
import { AppDownloadComponent } from './pages/app-download/app-download.component';
import { DesignationsComponent } from './pages/employees/designations/designations.component';
import { AttendanceLogsComponent } from "./pages/attendances/attendance-logs/attendance-logs.component";


const emp_routes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'list', component: EmployeeListComponent },
  { path: 'list/:id', component: EmpEditComponent },
  { path: 'designations', component: DesignationsComponent }
];



const page_routes: Routes = [
  { path: '', redirectTo: 'settings', pathMatch: 'full' },
  { path: 'employees', loadChildren: 'app/pages/employees/employees.module#EmployeesModule' },
  { path: 'attendances', loadChildren: 'app/pages/attendances/attendances.module#AttendancesModule' },
  { path: 'settings', loadChildren: 'app/pages/settings/settings.module#SettingsModule' },
];

// main routes
const routes: Routes = [
  { path: '', redirectTo: 'pages', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  { path: 'pages', component: PagesComponent, canActivate: [UserGuard], children: page_routes },
  { path: 'loginViaOrg', component: OrgLoginComponent },
  { path: 'download', component: AppDownloadComponent },
  { path: '**', redirectTo: 'pages' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
