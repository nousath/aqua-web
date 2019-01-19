import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Location } from '@angular/common'
import { Page } from '../../../common/contracts/page';
import { DeviceLogs, Device, Log } from '../../../models';
import { ToastyService } from 'ng2-toasty';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from '../../../services/local-storage.service';
import { AmsEmployeeService, AmsDeviceService } from '../../../services';
declare var $: any;

@Component({
  selector: 'aqua-diagnostics',
  templateUrl: './diagnostics.component.html',
  styleUrls: ['./diagnostics.component.css']
})
export class DiagnosticsComponent implements OnInit, OnDestroy, AfterViewInit {

  logs: Page<Log>;
  devices: Page<Device>;
  status: string;
  date: any = null;
  pageSize: any;

  constructor(private toastyService: ToastyService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location,
    private store: LocalStorageService,
    private amsEmployeeService: AmsEmployeeService,
    private amsDeviceService: AmsDeviceService) {

    this.logs = new Page({
      api: amsDeviceService.logs,
      filters: [{
        field: 'org',
        value: this.activatedRoute.queryParams['value']['org']
      }, {
        field: 'level',
        value: this.activatedRoute.queryParams['value']['level']
      }, {
        field: 'app',
        value: this.activatedRoute.queryParams['value']['app']
      }, {
        field: 'deviceId',
        value: this.activatedRoute.queryParams['value']['deviceId']
      }, {
        field: 'timeStamp',
        value: this.activatedRoute.queryParams['value']['timeStamp']
      }, {
        field: 'location',
        value: this.activatedRoute.queryParams['value']['location']
      }, {
        field: 'message',
        value: this.activatedRoute.queryParams['value']['message']
      }],
      location: location
    });

    this.devices = new Page({
      api: amsDeviceService.devices,
      filters: []
    });

    this.activatedRoute.queryParams.subscribe(query => {
      this.logs.filters.properties['level'].value = query['level'] || 'all';
      this.logs.filters.properties['timeStamp'].value = query['timeStamp'] ? query['timeStamp'] : new Date().toISOString();
      this.logs.filters.properties['deviceId'].value = query['deviceId'];
      this.logs.filters.properties['message'].value = query['message'];
    });
    this.getLogs();
  }

  getLogs() {
    this.logs.fetch().catch(err => this.toastyService.error({ title: 'Error', msg: err }));
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
      this.logs.filters.properties['date'].value = e.date.toISOString();
      this.getLogs();
    });
  }

  ngOnInit() {
    this.devices.fetch();
  }
  ngOnDestroy() {
  }

  reset() {
    this.logs.filters.reset();
    this.getLogs();
    this.store.removeItem('device-logs-filter')
  }
}
