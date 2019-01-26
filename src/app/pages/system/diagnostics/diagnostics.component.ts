import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Location } from '@angular/common'
import { PagerModel } from '../../../common/ng-structures';
import { DeviceLogs, Device, Log, Employee } from '../../../models';
import { ToastyService } from 'ng2-toasty';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from '../../../services/local-storage.service';
import { AmsEmployeeService, AmsDeviceService } from '../../../services';
import { getErrorLogger } from '@angular/core/src/errors';
declare var $: any;

@Component({
  selector: 'aqua-diagnostics',
  templateUrl: './diagnostics.component.html',
  styleUrls: ['./diagnostics.component.css']
})
export class DiagnosticsComponent implements OnInit, OnDestroy, AfterViewInit {

  logs: PagerModel<Log>;
  devices: PagerModel<Device>;
  status: string;
  showFilters = false;

  constructor(private toastyService: ToastyService,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private amsDeviceService: AmsDeviceService) {

    this.logs = new PagerModel({
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
        field: 'userId',
        value: this.activatedRoute.queryParams['value']['userId']
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

    this.devices = new PagerModel({
      api: amsDeviceService.devices,
      filters: []
    });

    this.activatedRoute.queryParams.subscribe(query => {
      this.logs.filters.properties['level'].value = query['level'] || 'all';
      this.logs.filters.properties['timeStamp'].value = query['timeStamp'] ? query['timeStamp'] : new Date().toISOString();
      this.logs.filters.properties['deviceId'].value = query['deviceId'];
      this.logs.filters.properties['message'].value = query['message'];
      this.logs.filters.properties['location'].value = query['location'];
      this.logs.filters.properties['userId'].value = query['userId'];
    });
    this.getLogs();
  }

  getLogs() {
    this.logs.fetch().catch(err => this.toastyService.error({ title: 'Error', msg: err }));
  }

  levelActivity(level: string) {
    this.logs.filters.properties['level'].value = level;
    this.getLogs()
  }

  userActivity(user: Employee) {
    this.logs.filters.properties['userId'].value = user.id;
    this.getLogs()
  }

  locationActivity(logLocation: string) {
    this.logs.filters.properties['location'].value = logLocation;
    this.getLogs()
  }

  appActivity(app: string) {
    this.logs.filters.properties['app'].value = app;
    this.getLogs()
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
  }

  clearAll() {
    this.amsDeviceService.logs.simplePost({}, 'remove-all').then(() => {
      return this.toastyService.info({ title: 'Info', msg: 'Removed all logs' });
    }).catch((err) => {
      return this.toastyService.error({ title: 'Could Not Remove Logs', msg: err });

    })
  }
}
