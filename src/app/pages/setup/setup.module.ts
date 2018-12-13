import { SharedModule } from '../../shared/shared.module';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SetupRoutingModule } from './setup.routing';
import { AlertsComponent } from './components/alerts/alerts.component';
import { CompleteComponent } from './components/complete/complete.component';
import { DevicesComponent } from './components/devices/devices.component';
import { DownloadComponent } from './components/download/download.component';
import { EmployeesComponent } from './components/employees/employees.component';
import { SyncappComponent } from './components/syncapp/syncapp.component';
import { WizardComponent } from './components/wizard/wizard.component';


@NgModule({
  imports: [
    RouterModule,
    SharedModule,
    SetupRoutingModule

  ],
  declarations: [

    AlertsComponent,
    CompleteComponent,
    DevicesComponent,
    DownloadComponent,
    EmployeesComponent,
    SyncappComponent,
    WizardComponent

  ],
  entryComponents: [
  ],

  exports: [
  ]
})
export class SetupModule { }
