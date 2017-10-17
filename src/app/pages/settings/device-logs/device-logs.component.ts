import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common'
import { ToastyService } from 'ng2-toasty';
import { AmsDeviceService, AmsEmployeeService } from "app/services";
import { DeviceLogs, Device } from "app/models";
import { Page } from "app/common/contracts/page";
import { LocalStorageService } from '../../../services/local-storage.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from "rxjs/Rx";
declare var $: any;

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'aqua-device-logs',
  templateUrl: './device-logs.component.html',
  styleUrls: ['./device-logs.component.css']
})
export class DeviceLogsComponent implements OnInit, OnDestroy, AfterViewInit {

  deviceLogs: Page<DeviceLogs>;
  devices: Page<Device>;
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

    this.deviceLogs = new Page({
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
      }],
      location: location
    });

    this.devices = new Page({
      api: amsDeviceService.devices,
      filters: []
    });

    this.subscription = this.activatedRoute.queryParams.subscribe(query => {
      if (query['ams_token'] && query['org_code']) {
        this.deviceLogs.filters.properties['level'].value = query['level'] || 'all';
        this.deviceLogs.filters.properties['date'].value = query['date'] ? query['date'] : new Date().toISOString();
        this.deviceLogs.filters.properties['deviceId'].value = query['deviceId'];
      }
    });
    this.getDeviceLogs();
  }

  getDeviceLogs() {
    this.deviceLogs.fetch().catch(err => this.toastyService.error({ title: 'Error', msg: err }));
  }

  ngAfterViewInit() {
    $("#dateSelector").datepicker("setDate", new Date(this.activatedRoute.queryParams['value']['date']));
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
      this.deviceLogs.filters.properties['date'].value = e.date.toISOString();
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
    this.store.removeItem("device-logs-filter")
  }
}
