import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResetPasswordDialogComponent } from '../../dialogs/reset-password-dialog/reset-password-dialog.component';
import { SharedModule } from '../../shared/shared.module';
import { SubAdminComponent } from './sub-admin.component';
import { RosterShiftsComponent } from './roster-shifts/roster-shifts.component';
import { SubAdminRoutingModule } from './sub-admin-routing.module';
// import { ShiftPickerComponent } from '../../shared/components/shift-picker/shift-picker.component';

@NgModule({
  imports: [
    SharedModule,
    SubAdminRoutingModule,
  ],
  declarations: [
    SubAdminComponent,
    RosterShiftsComponent,
    // ShiftPickerComponent
  ],
  exports: [
    SubAdminComponent,
    RosterShiftsComponent,
    // ShiftPickerComponent
  ]
})
export class SubAdminModule { }

