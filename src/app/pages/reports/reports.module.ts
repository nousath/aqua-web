import { SharedModule } from '../../shared/shared.module';
import { NgModule } from '@angular/core';

import { ReportsComponent } from './reports/reports.component';
import { ReportFiltersComponent } from './report-filters/report-filters.component';
import { ReportListsComponent } from './report-lists/report-lists.component';

import { RouterModule } from '@angular/router';
import { ReportsRoutingModule } from './reports.routing';
import { ReportCardComponent } from './components/report-card/report-card.component';

@NgModule({
  imports: [
    RouterModule,
    SharedModule,
    ReportsRoutingModule,
  ],
  declarations: [
    ReportsComponent,
    ReportCardComponent,
    ReportFiltersComponent,
    ReportListsComponent,
  ],
  entryComponents: [],
  exports: []
})
export class ReportsModule { }
