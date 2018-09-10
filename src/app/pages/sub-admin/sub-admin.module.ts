import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResetPasswordDialogComponent } from '../../dialogs/reset-password-dialog/reset-password-dialog.component';
import { SharedModule } from '../../shared/shared.module';
import { SubAdminComponent } from './sub-admin.component';
import { RosterShiftsComponent } from './roster-shifts/roster-shifts.component';
import { SubAdminRoutingModule } from './sub-admin-routing.module';
import { DailyShiftRosterComponent } from './daily-shift-roster/daily-shift-roster.component';
import { RosterShiftsMobileComponent } from './roster-shifts-mobile/roster-shifts-mobile.component';

@NgModule({
  imports: [
    SharedModule,
    SubAdminRoutingModule,

  ],
  declarations: [
    SubAdminComponent,
    RosterShiftsComponent,
    DailyShiftRosterComponent,
    RosterShiftsMobileComponent,
  ],
  exports: [
    SubAdminComponent,
    RosterShiftsComponent,
    DailyShiftRosterComponent,
    RosterShiftsMobileComponent,
  ]
})
export class SubAdminModule { }

