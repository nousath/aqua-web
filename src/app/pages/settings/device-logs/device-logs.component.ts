import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common'
import { ToastyService } from 'ng2-toasty';

import { LocalStorageService } from '../../../services/local-storage.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { PagerModel } from '../../../common/ng-structures';
import { DeviceLogs, Device } from '../../../models';
import { AmsEmployeeService, AmsDeviceService } from '../../../services';
declare var $: any;

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'aqua-device-logs',
  templateUrl: './device-logs.component.html',
  styleUrls: ['./device-logs.component.css']
})
export class DeviceLogsComponent implements OnInit, OnDestroy, AfterViewInit {

  deviceLogs: PagerModel<DeviceLogs>;
  devices: PagerModel<Device>;
  status: string;
  date: any = null;
  pageSize: any;
  subscription: Subscription;

  constructor(private toastyService: ToastyService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location,
    private store: LocalStorageService,
    private amsEmployeeService: AmsEmployeeService,
    private amsDeviceService: AmsDeviceService) {

    this.deviceLogs = new PagerModel({
      api: amsDeviceService.deviceLogs,
      filters: [{
        field: 'level',
        value: this.activatedRoute.queryParams['value']['level']
      }, {
        field: 'deviceId',
        value: this.activatedRoute.queryParams['value']['deviceId']
      }, {
        field: 'date',
        value: this.activatedRoute.queryParams['value']['date']
      }, {
        field: 'description',
        value: this.activatedRoute.queryParams['value']['description']
      }],
      location: location
    });

    this.devices = new PagerModel({
      api: amsDeviceService.devices,
      filters: []
    });

    this.subscription = this.activatedRoute.queryParams.subscribe(query => {
      if (query['ams_token'] && query['org_code']) {
        this.deviceLogs.filters.properties['level'].value = query['level'] || 'all';
        this.deviceLogs.filters.properties['date'].value = query['date'] ? query['date'] : new Date().toISOString();
        this.deviceLogs.filters.properties['deviceId'].value = query['deviceId'];
        this.deviceLogs.filters.properties['description'].value = query['description'];
      }
    });
    this.getDeviceLogs();
  }

  getDeviceLogs() {
    this.deviceLogs.fetch().catch(err => this.toastyService.error({ title: 'Error', msg: err }));
  }

  ngAfterViewInit() {
    $('#dateSelector').datepicker('setDate', new Date(this.activatedRoute.queryParams['value']['date']));
    $('#dateSelector').datepicker({
      format: 'dd/mm/yyyy',
      minViewMode: 0,
      maxViewMode: 2,
      autoclose: true,
      maxDate: new Date()
    }).on('changeDate', (e) => {
      if (new Date(e.date) > new Date()) {
        return this.toastyService.info({ title: 'Info', msg: 'Date should be less than or equal to current date' });
      }
      if (e.date) {
        this.deviceLogs.filters.properties['date'].value = e.date.toISOString();
      }
      this.getDeviceLogs();
    });
  }


  ngOnInit() {
    this.devices.fetch();
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  reset() {
    this.deviceLogs.filters.reset();
    this.getDeviceLogs();
    this.store.removeItem('device-logs-filter')
  }
}
