import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingsComponent } from './settings.component';
import { ShiftsComponent } from './shifts/shifts.component';
import { ShiftTypeNewComponent } from './shift-type-new/shift-type-new.component';
import { DevicesComponent } from './devices/devices.component';
import { DeviceLogsComponent } from './device-logs/device-logs.component';
import { HolidaysComponent } from './holidays/holidays.component';
import { AlertsComponent } from './alerts/alerts.component';
import { AlterTypesComponent } from './alter-types/alter-types.component';
import { AlterEditComponent } from './alter-edit/alter-edit.component';
import { ChannelTypesComponent } from './channel-types/channel-types.component';
import { ChannelTypeEditComponent } from './channel-type-edit/channel-type-edit.component';

const routes: Routes = [
  {
    path: '', component: SettingsComponent, children: [
      { path: '', redirectTo: 'shifts', pathMatch: 'full' },
      { path: 'shifts', component: ShiftsComponent },
      { path: 'shifts/new', component: ShiftTypeNewComponent },
      { path: 'shifts/edit/:id', component: ShiftTypeNewComponent },
      { path: 'devices', component: DevicesComponent },
      { path: 'deviceLogs', component: DeviceLogsComponent },
      { path: 'holidays', component: HolidaysComponent },
      { path: 'alerts', component: AlertsComponent },
      { path: 'alerts/types', component: AlterTypesComponent },
      { path: 'alerts/:id', component: AlterEditComponent },
      { path: 'channelTypes', component: ChannelTypesComponent },
      { path: 'channelTypes/:id', component: ChannelTypeEditComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
