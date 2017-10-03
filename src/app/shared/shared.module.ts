import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";

import { ToastyModule } from "ng2-toasty";
import { NgxPaginationModule } from 'ngx-pagination';
import { FileUploadModule } from 'ng2-file-upload';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { AgmCoreModule } from '@agm/core';
import { RouterModule } from "@angular/router";

import {
  AutoCompleteService,
  EmsEmployeeService,
  AmsEmployeeService,
  AmsShiftService,
  AmsLeaveService,
  AmsAttendanceService,
  AmsDeviceService,
  AmsOrganizationService,
  AmsAlertService,
  AmsHolidayService,
  EmsDesignationService,
  EmsOrganizationService,
  EmsAuthService,
  AmsTimelogsService
} from "../services";

import { ValidatorService } from '../services/validator.service';
import { LocalStorageService } from "../services/local-storage.service";
import { TimePipe } from './time.pipe';
import { Angulartics2Module, Angulartics2GoogleAnalytics } from 'angulartics2';
import { AmsTagService } from '../services/ams/ams-tag.service';


import {
  MdTooltipModule,
  MdTabsModule,
  MdSlideToggleModule,
  MdIconModule,
  MdDialogModule,
  MdButtonModule,
  MdListModule,
  MdCardModule,
  MdToolbarModule,
  MdProgressSpinnerModule,
  MdProgressBarModule,
  MdAutocompleteModule,
  MdButtonToggleModule,
  MdCheckboxModule,
  MdChipsModule,
  MdTableModule,
  MdDatepickerModule,
  MdExpansionModule,
  MdGridListModule,
  MdInputModule,
  MdMenuModule,
  MdCoreModule,
  MdPaginatorModule,
  MdRadioModule,
  MdRippleModule,
  MdSelectModule,
  MdSidenavModule,
  MdSliderModule,
  MdSnackBarModule,
  MdSortModule,
  MdNativeDateModule,
  StyleModule,
  MaterialModule
} from '@angular/material';

export const MaterialModules = [
  MdAutocompleteModule,
  MdButtonModule,
  MdButtonToggleModule,
  MdCardModule,
  MdCheckboxModule,
  MdChipsModule,
  MdTableModule,
  MdDatepickerModule,
  MdDialogModule,
  MdExpansionModule,
  MdGridListModule,
  MdIconModule,
  MdInputModule,
  MdListModule,
  MdMenuModule,
  MdCoreModule,
  MdPaginatorModule,
  MdProgressBarModule,
  MdProgressSpinnerModule,
  MdRadioModule,
  MdRippleModule,
  MdSelectModule,
  MdSidenavModule,
  MdSlideToggleModule,
  MdSliderModule,
  MdSnackBarModule,
  MdSortModule,
  MdTabsModule,
  MdToolbarModule,
  MdTooltipModule,
  MdNativeDateModule,
  StyleModule
]

@NgModule({
  declarations: [TimePipe],
  providers: [
    EmsEmployeeService,
    EmsDesignationService,
    EmsOrganizationService,
    EmsAuthService,
    AmsEmployeeService,
    AmsShiftService,
    ValidatorService,
    AmsLeaveService,
    AmsAttendanceService,
    AmsDeviceService,
    AmsOrganizationService,
    AmsAlertService,
    AmsHolidayService,
    AutoCompleteService,
    AmsTimelogsService,
    LocalStorageService,
    AmsTagService
  ],
  imports: [
    HttpModule,
    Angulartics2Module.forChild(),
    ToastyModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyA3-BQmJVYB6_soLJPv7cx2lFUMAuELlkM'
    }),
  ],
  exports: [
    CommonModule,
    MaterialModules,
    Angulartics2Module,
    FormsModule,
    HttpModule,
    ToastyModule,
    FileUploadModule,
    NgxPaginationModule,
    NguiAutoCompleteModule,
    AgmCoreModule,
    TimePipe
  ]
})
export class SharedModule { }
