import { NgModule } from '@angular/core';
import { RouterModule } from "@angular/router";

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

@NgModule({
  declarations: [
    AppComponent,
    PagesComponent,
    LoginComponent,
    OrgLoginComponent,
    AppDownloadComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    AppRoutingModule,
  ],
  providers: [
    LoginGuard, UserGuard,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
