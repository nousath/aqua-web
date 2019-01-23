import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { SharedModule } from '../../shared/shared.module';

import { DiagnosticsComponent } from './diagnostics/diagnostics.component';
import { SystemRoutingModule } from './system-routing.module';
import { SystemUsageComponent } from './system-usage/system-usage.component';


@NgModule({
  imports: [
    SharedModule,
    SystemRoutingModule
  ],
  declarations: [
    SystemUsageComponent,
    DiagnosticsComponent
  ],
  entryComponents: [
  ],
  exports: [
    SystemUsageComponent,
    DiagnosticsComponent
  ]
})
export class SystemModule { }
