// import { Insight } from './../../../models/insight.model';
// import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

// import { AmsAlertService, InsightsService } from '../../../services';
// import { Router, ActivatedRoute } from '@angular/router';
// import { ToastyService } from 'ng2-toasty';
// import { AmsAlert } from '../../../models';
// import { Model } from '../../../common/contracts/model';
// import { Subscription } from 'rxjs/Rx';
// import * as _ from 'lodash';
// import { AlertParameter } from '../../../models/alert-parameter.model';
// import { ValidatorService } from '../../../services/validator.service';
// import { Angulartics2 } from 'angulartics2';


// // import { OutputEmitter } from '@angular/compiler/src/output/abstract_emitter';
// declare var $: any;

// @Component({
//   selector: 'aqua-report-filters',
//   templateUrl: './report-filters.component.html',
//   styleUrls: ['./report-filters.component.css']
// })

// export class ReportFiltersComponent  implements OnInit {

//    alert: Model<Insight>;
//   subscription: Subscription;
//   reset: Function;
//  resetConfig: Boolean = false;
//  public date= new Date();


//   constructor(private amsInsightService: InsightsService,
//     private toastyService: ToastyService,
//     public validatorService: ValidatorService,
//     private activatedRoute: ActivatedRoute,
//     private angulartics2: Angulartics2,
//     private router: Router) {

//     this.alert = new Model({
//       api: amsInsightService.insights,
//       properties: new Insight()
//     });



//     this.subscription = activatedRoute.params.subscribe(
//       params => {
//         const alertId: string = params['id'];
//         this.alert.fetch(alertId).then(
//           data => {

//             if (!this.alert.properties.config.processor) {

//               this.alert.properties.config['processor'] = { 'channel': '' };
//             }
//           }
//         ).catch(err => toastyService.error({ title: 'Error', msg: err }));
//       }
//     );
//   }


//   ngOnInit() {

//   }


//   ngAfterViewInit() {
//   $('#dateSelector').datepicker({

//     minViewMode: 0,
//     maxViewMode: 2,
//     autoclose: true,
//     maxDate: new Date()
//   }).on('changeDate', (e) => {
//     this.alert.properties.date = new Date(e.date).toISOString();
//   });
// }


// }

