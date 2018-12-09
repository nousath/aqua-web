import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { LoginGuard, UserGuard } from './guards';
import { AppDownloadComponent } from './pages/app-download/app-download.component';
import { AdminGuard } from './guards/admin.guard';
import { SystemUsageComponent } from './pages/system-usage/system-usage.component';

// main routes
const routes: Routes = [
  { path: '', redirectTo: 'attendances', pathMatch: 'full' },
  { path: 'home', loadChildren: 'app/pages/home/home.module#HomeModule', canActivate: [UserGuard] },
  { path: 'employees', loadChildren: 'app/pages/employees/employees.module#EmployeesModule', canActivate: [AdminGuard] },
  { path: 'attendances', loadChildren: 'app/pages/attendances/attendances.module#AttendancesModule', canActivate: [UserGuard, AdminGuard] },
  { path: 'settings', loadChildren: 'app/pages/settings/settings.module#SettingsModule', canActivate: [AdminGuard] },
  { path: 'subAdmin', loadChildren: 'app/pages/sub-admin/sub-admin.module#SubAdminModule', canActivate: [AdminGuard] },
  { path: 'system/usage', component: SystemUsageComponent },
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  { path: 'download', component: AppDownloadComponent },
  { path: '**', redirectTo: 'attendances' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
