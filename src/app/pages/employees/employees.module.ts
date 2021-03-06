import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeesRoutingModule } from './employees-routing.module';
import { EmployeesComponent } from './employees.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { EmpEditComponent } from './emp-edit/emp-edit.component';
import { DesignationsComponent } from './designations/designations.component';
import { ConfirmDialogComponent } from '../../dialogs/confirm-dialog/confirm-dialog.component';
// import { ResetPasswordDialogComponent } from '../../dialogs/reset-password-dialog/reset-password-dialog.component';
import { SharedModule } from '../../shared/shared.module';
import { DepartmentsComponent } from './departments/departments.component';
import { FingerPrintComponent } from './finger-print/finger-print.component';
import { RelievingDialogComponent } from '../../dialogs/relieving-dialog/relieving-dialog.component';
import { EmpShiftComponent } from './emp-shift/emp-shift.component';
import { EmpLeavesComponent } from './emp-leaves/emp-leaves.component';
import { ContractorsComponent } from './contractors/contractors.component';
import { DivisionsComponent } from './divisions/divisions.component';

@NgModule({
  imports: [
    SharedModule,
    EmployeesRoutingModule
  ],
  declarations: [
    EmployeesComponent,
    EmployeeListComponent,
    EmpEditComponent,
    DesignationsComponent,
    ConfirmDialogComponent,
    FingerPrintComponent,
    DepartmentsComponent,
    FingerPrintComponent,
    RelievingDialogComponent,
    EmpLeavesComponent,
    EmpShiftComponent,
    ContractorsComponent,
    DivisionsComponent
    // ResetPasswordDialogComponent
  ],
  entryComponents: [
    ConfirmDialogComponent,
    RelievingDialogComponent
    // ResetPasswordDialogComponent
  ],
  exports: [
    EmployeesComponent,
    EmployeeListComponent,
    EmpEditComponent,
    DesignationsComponent,
    ConfirmDialogComponent,
    DepartmentsComponent,
    ContractorsComponent
    // ResetPasswordDialogComponent
  ]
})
export class EmployeesModule { }

