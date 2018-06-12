import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResetPasswordDialogComponent } from '../../dialogs/reset-password-dialog/reset-password-dialog.component';
import { SharedModule } from '../../shared/shared.module';
import { SubAdminComponent } from './sub-admin.component';
import { RosterShiftsComponent } from './roster-shifts/roster-shifts.component';
import { SubAdminRoutingModule } from './sub-admin-routing.module';
import { DailyShiftRosterComponent } from './daily-shift-roster/daily-shift-roster.component';
// import { ShiftPickerComponent } from '../../shared/components/shift-picker/shift-picker.component';

@NgModule({
  imports: [
    SharedModule,
    SubAdminRoutingModule,
  ],
  declarations: [
    SubAdminComponent,
    RosterShiftsComponent,
    DailyShiftRosterComponent,
    // ShiftPickerComponent
  ],
  exports: [
    SubAdminComponent,
    RosterShiftsComponent,
    DailyShiftRosterComponent
    // ShiftPickerComponent
  ]
})
export class SubAdminModule { }

