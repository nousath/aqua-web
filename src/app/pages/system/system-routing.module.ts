import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DiagnosticsComponent } from './diagnostics/diagnostics.component';
import { SystemUsageComponent } from './system-usage/system-usage.component';

const routes: Routes = [
  {
    path: '', children: [
      { path: '', redirectTo: 'diagnostics', pathMatch: 'full' },
      { path: 'diagnostics', component: DiagnosticsComponent },
      { path: 'usage', component: SystemUsageComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemRoutingModule { }
