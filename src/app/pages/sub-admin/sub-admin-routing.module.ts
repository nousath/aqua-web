import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SubAdminComponent } from './sub-admin.component';
import { RosterShiftsComponent } from './roster-shifts/roster-shifts.component';



const routes: Routes = [
  {
    path: '', component: SubAdminComponent, children: [
      { path: '', redirectTo: 'shifts', pathMatch: 'full' },
      { path: 'shifts', component: RosterShiftsComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubAdminRoutingModule { }
