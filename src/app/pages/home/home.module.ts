import { SharedModule } from '../../shared/shared.module';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeRoutingModule } from './home.routing';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AttendancesModule } from '../attendances/attendances.module';

@NgModule({
  imports: [
    RouterModule,
    SharedModule,
    AttendancesModule,
    HomeRoutingModule
  ],
  declarations: [
    DashboardComponent
  ],
  entryComponents: [
  ],

  exports: [
  ]
})
export class HomeModule { }
