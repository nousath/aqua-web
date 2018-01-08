import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResetPasswordDialogComponent } from '../../dialogs/reset-password-dialog/reset-password-dialog.component';
import { SharedModule } from '../../shared/shared.module';
import { SubAdminComponent } from './sub-admin.component';
// import { ShiftChangeComponent } from './shift-change/shift-change.component';
import { SubAdminRoutingModule } from './sub-admin-routing.module';

@NgModule({
  imports: [
    SharedModule,
    SubAdminRoutingModule
  ],
  declarations: [
    SubAdminComponent,
    // ShiftChangeComponent
  ],
  exports: [
    SubAdminComponent,
    // ShiftChangeComponent
  ]
})
export class SubAdminModule { }

