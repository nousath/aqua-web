import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SubAdminComponent } from './sub-admin.component';
// import { ShiftChangeComponent } from './shift-change/shift-change.component';



const routes: Routes = [
  {
    path: '', component: SubAdminComponent, children: [
      { path: '', redirectTo: 'shifts', pathMatch: 'full' },
      // { path: 'shifts', component: ShiftChangeComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubAdminRoutingModule { }
