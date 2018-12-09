import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TeamComponent } from './components/team/team.component';



const routes: Routes = [
  {
    path: '', children: [
      { path: '', redirectTo: 'my', pathMatch: 'full' },
      { path: 'my', component: DashboardComponent },
      { path: 'team', component: TeamComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
