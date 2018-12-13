import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeesComponent } from '../employees/employees.component';
import { DevicesComponent } from '../settings/devices/devices.component';
import { SyncappComponent } from './components/syncapp/syncapp.component';
import { AlertsComponent } from '../settings/alerts/alerts.component';
import { CompleteComponent } from './components/complete/complete.component';
import { DownloadComponent } from './components/download/download.component';

const routes: Routes = [{

  path: 'wizard', children: [
    { path: '', redirectTo: 'employees', pathMatch: 'full' },
    { path: 'employees', component: EmployeesComponent },
    { path: 'devices', component: DevicesComponent },
    { path: 'syncapp', component: SyncappComponent },
    { path: 'alerts', component: AlertsComponent },
    { path: 'complete', component: CompleteComponent }
  ]
}, {
  path: 'download/:orgCode/:token/:code', component: DownloadComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SetupRoutingModule { }
