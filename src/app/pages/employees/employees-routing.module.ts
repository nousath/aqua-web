import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeesComponent } from './employees.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { EmpEditComponent } from './emp-edit/emp-edit.component';
import { DesignationsComponent } from './designations/designations.component';
import { DepartmentsComponent } from './departments/departments.component';
import { ContractorsComponent } from './contractors/contractors.component';
import { DivisionsComponent } from './divisions/divisions.component';


const routes: Routes = [
  {
    path: '', component: EmployeesComponent, children: [
      { path: '', component: EmployeeListComponent, pathMatch: 'full' },
      { path: 'designations', component: DesignationsComponent },
      { path: 'departments', component: DepartmentsComponent },
      { path: 'contractors', component: ContractorsComponent },
      { path: 'divisions', component: DivisionsComponent },
      { path: ':id', component: EmpEditComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeesRoutingModule { }
