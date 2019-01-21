import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { LoginGuard, UserGuard, OwnerGuard } from './guards';
import { OrgLoginComponent } from './pages/org-login/org-login.component';
import { AppDownloadComponent } from './pages/app-download/app-download.component';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { Angulartics2Module, Angulartics2GoogleAnalytics } from 'angulartics2';
import { AdminGuard } from './guards/admin.guard';
import { SystemUsageComponent } from './pages/system-usage/system-usage.component';
import { ResetPasswordDialogComponent } from './dialogs/reset-password-dialog/reset-password-dialog.component';
import { EmsDepartmentService, EmsContractorService, EmsDivisionService } from './services';
import { LeaveConfirmDialogComponent } from './dialogs/leave-confirm-dialog/leave-confirm-dialog.component';
import { LeaveReasonDialogComponent } from './dialogs/leave-reason-dialog/leave-reason-dialog.component';
import { AddShiftDialogComponent } from './dialogs/add-shift-dialog/add-shift-dialog.component';
import { NavigationBarComponent } from './shared/components/navigation-bar/navigation-bar.component';
import { CopyContentComponent } from './dialogs/copy-content/copy-content.component';
import { SignupComponent } from './pages/signup/signup.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    OrgLoginComponent,
    AppDownloadComponent,
    SystemUsageComponent,
    ResetPasswordDialogComponent,
    NavigationBarComponent,
    LeaveConfirmDialogComponent,
    LeaveReasonDialogComponent,
    AddShiftDialogComponent,
    CopyContentComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    Angulartics2Module.forRoot([Angulartics2GoogleAnalytics]),
    SharedModule,
    AppRoutingModule
  ],
  providers: [
    LoginGuard, UserGuard, AdminGuard, OwnerGuard, EmsDepartmentService, EmsContractorService, EmsDivisionService
  ],
  entryComponents: [
    ResetPasswordDialogComponent,
    LeaveConfirmDialogComponent,
    LeaveReasonDialogComponent,
    AddShiftDialogComponent,
    CopyContentComponent
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
