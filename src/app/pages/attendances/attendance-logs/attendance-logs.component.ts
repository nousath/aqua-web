import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Employee, TimeLogs, DayEvent } from "app/models";
import { Model } from "app/common/contracts/model";
import { AmsEmployeeService, AmsAttendanceService } from "app/services";
import { Subscription } from "rxjs/Rx";
import { ToastyService } from "ng2-toasty";
import { Page } from "app/common/contracts/page";
import { AmsTimelogsService } from "app/services/ams/ams-timelogs.service";
import * as _ from "lodash";
import { TimeLogsLocation } from '../../../models/time-logs';

@Component({
  selector: 'aqua-attendance-logs',
  templateUrl: './attendance-logs.component.html',
  styleUrls: ['./attendance-logs.component.css']
})
export class AttendanceLogsComponent implements OnInit {
  employee: Model<Employee>;
  logs: Page<TimeLogs>;
  attendances: Page<DayEvent>;
  timeLogs: Model<TimeLogs>;
  subscription: Subscription;
  empId: any;
  ofDate: any;
  attendance: any
  date: any;
  isButton = true;
  checkTime: any;
  checkStatus: any;


  constructor(private activatedRoute: ActivatedRoute,
    private toastyService: ToastyService,
    private amsAttendanceService: AmsAttendanceService,
    private amsTimelogsService: AmsTimelogsService,
    private amsEmployeeService: AmsEmployeeService) {
    this.employee = new Model({
      api: amsEmployeeService.employeesForAdmin,
      properties: new Employee()
    })
    this.timeLogs = new Model({
      api: amsTimelogsService.timeLogs,
      properties: new TimeLogs()
    })

    this.attendances = new Page({
      api: amsAttendanceService.attendance,
      filters: [{
        field: 'employee',
        value: null
      },
      {
        field: 'ofDate',
        value: null
      }]
    })
    this.logs = new Page({
      api: amsTimelogsService.timeLogs,
      filters: [{
        field: 'employeeId',
        value: null
      },
      {
        field: 'fromDate',
        value: null
      }]
    })

    this.subscription = this.activatedRoute.params.subscribe(
      params => {
        this.empId = params['empId']
        this.ofDate = params['ofDate']
        this.logs.filters.properties['employeeId'].value = this.empId;
        this.employee.fetch(this.empId).catch(err => this.toastyService.error({ title: 'Error', msg: err }));
        this.getAttendance();

      }
    )

  }

  getAttendance() {
    this.attendances.filters.properties['employee'].value = this.empId;
    this.attendances.filters.properties['ofDate'].value =  new Date(this.ofDate).toISOString();
    this.attendances.fetch().then(
      (data) => {
        this.attendance = data.items[0];
        this.getLogs();
      }).catch(err => this.toastyService.error({ title: 'Error', msg: err }));

  }

  getLogs() {
    this.logs.filters.properties['fromDate'].value = new Date(this.ofDate).toISOString();
    this.logs.fetch().then(
      data => {
        _.each(this.logs.items, (log: TimeLogs) => {
          if (log.location && log.location.coordinates) {
            log.location['has'] = true;
            log.location['show'] = false;
            if (!log.location.coordinates[0] || !log.location.coordinates[1]) {
              log.location['has'] = false;
            }
          } else {
            log['location'] = new TimeLogsLocation();
          }
        });
      }
    ).catch(err => this.toastyService.error({ title: 'Error', msg: err }));
  }

  checkUpdate() {
    let h: number, m: number;
    if (this.checkStatus === 'checkIn') {
      this.timeLogs.properties.employee.id = this.empId;
      this.timeLogs.properties.type = this.checkStatus;
      let checkIns: string[] = this.checkTime.split(':');
      this.timeLogs.properties.time = new Date(new Date(this.attendance.ofDate).setHours(parseInt(checkIns[0]), parseInt(checkIns[1]))).toISOString();
      this.timeLogs.properties.source = 'byAdmin';
    }
    if (this.checkStatus === 'checkOut') {
      this.timeLogs.properties.employee.id = this.empId;
      this.timeLogs.properties.type = this.checkStatus;
      let checkOuts: string[] = this.checkTime.split(':');
      this.timeLogs.properties.time = new Date(new Date(this.attendance.ofDate).setHours(parseInt(checkOuts[0]), parseInt(checkOuts[1]))).toISOString();      this.timeLogs.properties.source = 'byAdmin';
    }
    this.timeLogs.save().then(data => {this.getAttendance(); }).catch(err => this.toastyService.error({ title: 'Error', msg: err }));

  }

  toggleLocation(loc: TimeLogsLocation) {
    loc.show = !loc.show;
  }

  ngOnInit() {
  }

}
