import { Component, OnInit, AfterViewInit } from '@angular/core';
import { PagerModel } from '../../../common/ng-structures';
import { Location } from '@angular/common';
import { Task } from '../../../models/task.model';
import { Device } from '../../../models';
import { ToastyService } from 'ng2-toasty';
import { AmsSystemUsageService, AmsDeviceService } from '../../../services';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
declare var $: any;

@Component({
  selector: 'aqua-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit, AfterViewInit {

  tasks: PagerModel<Task>;
  devices: PagerModel<Device>;
  status: string;
  showFilters = false;

  constructor(
    private toastyService: ToastyService,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private systemService: AmsSystemUsageService,
    private amsDeviceService: AmsDeviceService
  ) {

    this.tasks = new PagerModel({
      api: systemService.tasks,
      filters: [{
        field: 'deviceId',
        value: this.activatedRoute.queryParams['value']['deviceId'] || 'any'
      }, {
        field: 'assignedTo',
        value: this.activatedRoute.queryParams['value']['assignedTo'] || 'any'
      }, {
        field: 'status',
        value: this.activatedRoute.queryParams['value']['status'] || 'any'
      }, {
        field: 'from',
        value: this.activatedRoute.queryParams['value']['from']
      }],
      location: location
    });

    this.devices = new PagerModel({
      api: amsDeviceService.devices,
      filters: []
    });
  }


  ngAfterViewInit() {
    $('#dateSelector').datepicker('setDate', new Date(this.activatedRoute.queryParams['value']['from']));
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
      this.tasks.filters.properties['from'].value = e.date.toISOString();
    });
  }


  ngOnInit() {
    this.fetch();
  }

  run(item: Task) {
    item.isProcessing = true;
    this.systemService.tasks.update(item.id, {
    }, null, 'run').then(() => {
      item.isProcessing = false;
      this.fetch();
    }).catch(err => {
      item.isProcessing = false;
      this.toastyService.error({ title: 'Error', msg: err });
    })
  }

  clear() {
    this.toastyService.error({ title: 'Error', msg: 'not implemented' });
  }
  reset() {
    this.tasks.filters.reset();
    this.fetch();
  }

  fetch() {
    this.tasks.fetch().then(() => {
      this.tasks.items = this.tasks.items.sort((a, b) => moment(a.date).isAfter(b.date) ? -1 : 1)
    })
  }

  stripErrors(meta: any) {
    const newMeta: any = {}

    for (const key of Object.keys(meta)) {
      if (key !== 'errors') {
        newMeta[key] = meta[key]
      }
    }

    return newMeta

  }

}
