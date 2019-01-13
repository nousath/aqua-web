import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { ToastyModule } from 'ng2-toasty';
import { NgxPaginationModule } from 'ngx-pagination';
import { FileUploadModule } from 'ng2-file-upload';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { AgmCoreModule } from '@agm/core';
import { RouterModule } from '@angular/router';

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
  AmsTimelogsService,
  AmsSystemUsageService,
  AmsEffectiveShiftService,
  AmsReportRequestService
} from '../services';

import { ValidatorService } from '../services/validator.service';
import { LocalStorageService } from '../services/local-storage.service';
import { TimePipe } from './pipes/time.pipe';
import { Angulartics2Module, Angulartics2GoogleAnalytics } from 'angulartics2';
import { AmsTagService } from '../services/ams/ams-tag.service';
import { ShiftPickerComponent } from './components/shift-picker/shift-picker.component';


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
import { ShiftTypeFilterPipe } from './pipes/shift-type-filter.pipe';
import { EmployeesFilterComponent } from './components/employees-filter/employees-filter.component';
import { FileUploaderDialogComponent } from './components/file-uploader-dialog/file-uploader-dialog.component';
import { BulkTimeLogsDialogComponent } from './components/bulk-time-logs-dialog/bulk-time-logs-dialog.component';
import { AddAttendanceLogsComponent } from './components/add-attendance-logs/add-attendance-logs.component';
import { DatesService } from './services/dates.service';
import { GetDateDialogComponent } from './components/get-date-dialog/get-date-dialog.component';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { ExtendShiftDialogComponent } from './components/extend-shift-dialog/extend-shift-dialog.component';
import { ShiftCountComponent } from './components/shift-count/shift-count.component';
import { NamePipe } from './pipes/name.pipe';
import { CommentDialogComponent } from './../dialogs/comment-dialog/comment-dialog.component';
import { DriveService } from './services/drive.service';
import { ImageEditorComponent } from './components/image-editor/image-editor.component';
import { UxService } from '../services/ux.service';
import { ProcessingIndicatorComponent } from './components/processing-indicator/processing-indicator.component';
import { PushEventService } from '../services/push-event.service';
import { GetValueDialogComponent } from './components/get-value-dialog/get-value-dialog.component';
import { CalendarViewComponent } from './components/calendar-view/calendar-view.component';



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
  StyleModule,
  AngularMultiSelectModule
];

@NgModule({
  declarations: [TimePipe,
    ShiftPickerComponent,
    ShiftTypeFilterPipe,
    EmployeesFilterComponent,
    AddAttendanceLogsComponent,
    FileUploaderDialogComponent,
    BulkTimeLogsDialogComponent,
    GetDateDialogComponent,
    ExtendShiftDialogComponent,
    ShiftCountComponent,
    CommentDialogComponent,
    NamePipe,
    ImageEditorComponent,
    ProcessingIndicatorComponent,
    GetValueDialogComponent,
    CalendarViewComponent
  ],
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
    AmsTagService,
    AmsSystemUsageService,
    AmsEffectiveShiftService,
    AmsReportRequestService,
    DatesService,
    DriveService,
    UxService,
    PushEventService
  ],
  imports: [
    HttpModule,
    CommonModule,
    FormsModule,
    MaterialModules,
    NguiAutoCompleteModule,
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
    AgmCoreModule,
    TimePipe,
    ShiftPickerComponent,
    EmployeesFilterComponent,
    AddAttendanceLogsComponent,
    ShiftCountComponent,
    CalendarViewComponent,
    ProcessingIndicatorComponent,
    NamePipe
  ],
  entryComponents: [
    CommentDialogComponent,
    FileUploaderDialogComponent,
    BulkTimeLogsDialogComponent,
    GetDateDialogComponent,
    GetValueDialogComponent,
    ExtendShiftDialogComponent,
    ImageEditorComponent
  ],

})
export class SharedModule { }
