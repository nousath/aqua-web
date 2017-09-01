import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeesComponent } from './employees.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { EmpEditComponent } from './emp-edit/emp-edit.component';
import { DesignationsComponent } from './designations/designations.component';


const routes: Routes = [
  {
    path: '', component: EmployeesComponent, children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: 'list', component: EmployeeListComponent },
      { path: 'list/:id', component: EmpEditComponent },
      { path: 'designations', component: DesignationsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeesRoutingModule { }
