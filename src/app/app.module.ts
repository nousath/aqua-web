import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PagesComponent } from './pages/pages.component';
import { LoginComponent } from './pages/login/login.component';
import { LoginGuard, UserGuard } from './guards';
import { OrgLoginComponent } from './pages/org-login/org-login.component';
import { AppDownloadComponent } from './pages/app-download/app-download.component';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { Angulartics2Module, Angulartics2GoogleAnalytics } from 'angulartics2';
import { AdminGuard } from './guards/admin.guard';
import { GkuAttendanceComponent } from './pages/gku-attendance/gku-attendance.component';
import { SystemUsageComponent } from './pages/system-usage/system-usage.component';
import { ResetPasswordDialogComponent } from './dialogs/reset-password-dialog/reset-password-dialog.component';
import { DepartmentsComponent } from './pages/employees/departments/departments.component';
import { EmsDepartmentService } from './services';
import { LeaveConfirmDialogComponent } from './dialogs/leave-confirm-dialog/leave-confirm-dialog.component';
import { LeaveReasonDialogComponent } from './dialogs/leave-reason-dialog/leave-reason-dialog.component';
import { AddShiftDialogComponent } from './dialogs/add-shift-dialog/add-shift-dialog.component';
import { NavigationBarComponent } from './shared/components/navigation-bar/navigation-bar.component';


@NgModule({
  declarations: [
    AppComponent,
    PagesComponent,
    LoginComponent,
    OrgLoginComponent,
    AppDownloadComponent,
    GkuAttendanceComponent,
    SystemUsageComponent,
    ResetPasswordDialogComponent,
    NavigationBarComponent,
    LeaveConfirmDialogComponent,
    LeaveReasonDialogComponent,
    AddShiftDialogComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    Angulartics2Module.forRoot([Angulartics2GoogleAnalytics]),
    SharedModule,
    AppRoutingModule
  ],
  providers: [
    LoginGuard, UserGuard, AdminGuard, EmsDepartmentService
  ],
  entryComponents: [
    ResetPasswordDialogComponent,
    LeaveConfirmDialogComponent,
    LeaveReasonDialogComponent,
    AddShiftDialogComponent,
  ],
  exports: [
    ResetPasswordDialogComponent,
    LeaveConfirmDialogComponent,
    LeaveReasonDialogComponent,
    AddShiftDialogComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
