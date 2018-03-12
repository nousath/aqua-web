// import { ReportFiltersComponent } from './shared/components/report-filters/report-filters.component';
import { DownloadReportComponent } from './pages/attendances/download-report/download-report.component';
import { ListReportComponent } from './pages/attendances/list-report/list-report.component';
import { ReportComponent } from './pages/attendances/report/report.component';
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
import { DailyShiftRosterComponent } from './pages/daily-shift-roster/daily-shift-roster.component';



@NgModule({
  declarations: [
    AppComponent,
    PagesComponent,
    LoginComponent,
    OrgLoginComponent,
    AppDownloadComponent,
    GkuAttendanceComponent,
    SystemUsageComponent,
    DailyShiftRosterComponent,
    

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    Angulartics2Module.forRoot([Angulartics2GoogleAnalytics]),
    SharedModule,
    AppRoutingModule,
  ],
  providers: [
    LoginGuard, UserGuard, AdminGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
