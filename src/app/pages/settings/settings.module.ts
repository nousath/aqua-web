import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsComponent } from './settings.component';
import { ShiftsComponent } from './shifts/shifts.component';
import { HolidaysComponent } from './holidays/holidays.component';
import { AlterTypesComponent } from './alter-types/alter-types.component';
import { AlterEditComponent } from './alter-edit/alter-edit.component';
import { AlertsComponent } from './alerts/alerts.component';
import { DevicesComponent } from './devices/devices.component';
import { ShiftTypeNewComponent } from './shift-type-new/shift-type-new.component';
import { ChannelTypeEditComponent } from './channel-type-edit/channel-type-edit.component';
import { DeviceLogsComponent } from './device-logs/device-logs.component';
import { SettingsRoutingModule } from './settings-routing.module';
import { DeviceDialogComponent } from '../../dialogs/device-dialog/device-dialog.component';
import { SyncDialogComponent } from '../../dialogs/sync-dialog/sync-dialog.component';
import { SharedModule } from '../../shared/shared.module';
import { ChannelTypesComponent } from './channel-types/channel-types.component';
import { ReportFormatComponent } from './report-format/report-format.component';


@NgModule({
  imports: [
    SharedModule,
    SettingsRoutingModule
  ],
  declarations: [
    SettingsComponent,
    ShiftsComponent,
    DevicesComponent,
    AlertsComponent,
    HolidaysComponent,
    AlterTypesComponent,
    AlterEditComponent,
    ShiftTypeNewComponent,
    DeviceLogsComponent,
    ChannelTypesComponent,
    ChannelTypeEditComponent,
    DeviceDialogComponent,
    SyncDialogComponent,
    ReportFormatComponent
  ],
  entryComponents: [
    DeviceDialogComponent,
    SyncDialogComponent,
  ],
  exports: [
    SettingsComponent,
    ShiftsComponent,
    DevicesComponent,
    AlertsComponent,
    HolidaysComponent,
    AlterTypesComponent,
    AlterEditComponent,
    ShiftTypeNewComponent,
    DeviceLogsComponent,
    ChannelTypesComponent,
    ChannelTypeEditComponent,
    DeviceDialogComponent,
    SyncDialogComponent,
  ]
})
export class SettingsModule { }

