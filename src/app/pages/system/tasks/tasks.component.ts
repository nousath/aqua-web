import { Component, OnInit, AfterViewInit } from '@angular/core';
import { PagerModel } from '../../../common/ng-structures';
import { Location } from '@angular/common';
import { Task } from '../../../models/task.model';
import { Device } from '../../../models';
import { ToastyService } from 'ng2-toasty';
import { AmsSystemUsageService, AmsDeviceService } from '../../../services';
import { ActivatedRoute } from '@angular/router';
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
        value: 'any'
      }, {
        field: 'status',
        value: 'any'
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
    this.tasks.fetch();
  }

  run(item: Task) {
    item.isProcessing = true;
    this.systemService.tasks.update(item.id, {
    }, null, 'run').then(() => {
      item.isProcessing = false;
      this.tasks.fetch();
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
    this.tasks.fetch();
  }

}
