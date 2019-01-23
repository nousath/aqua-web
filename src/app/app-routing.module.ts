import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { LoginGuard, UserGuard } from './guards';
import { AppDownloadComponent } from './pages/app-download/app-download.component';
import { AdminGuard } from './guards/admin.guard';
import { OwnerGuard } from './guards/owner.guard';
import { SystemAdminGuard } from './guards/system-admin.guard';

// main routes
const routes: Routes = [
  { path: '', redirectTo: 'attendances', pathMatch: 'full' },
  { path: 'home', loadChildren: 'app/pages/home/home.module#HomeModule', canActivate: [UserGuard] },
  { path: 'employees', loadChildren: 'app/pages/employees/employees.module#EmployeesModule', canActivate: [AdminGuard] },
  { path: 'attendances', loadChildren: 'app/pages/attendances/attendances.module#AttendancesModule', canActivate: [AdminGuard] },
  { path: 'settings', loadChildren: 'app/pages/settings/settings.module#SettingsModule', canActivate: [AdminGuard] },
  { path: 'subAdmin', loadChildren: 'app/pages/sub-admin/sub-admin.module#SubAdminModule', canActivate: [AdminGuard] },
  { path: 'setup', loadChildren: 'app/pages/setup/setup.module#SetupModule', canActivate: [OwnerGuard] },

  { path: 'reports', loadChildren: 'app/pages/reports/reports.module#ReportsModule', canActivate: [OwnerGuard] },
  { path: 'system', loadChildren: 'app/pages/system/system.module#SystemModule', canActivate: [SystemAdminGuard] },
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  { path: 'download', component: AppDownloadComponent },
  { path: '**', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, enableTracing: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
