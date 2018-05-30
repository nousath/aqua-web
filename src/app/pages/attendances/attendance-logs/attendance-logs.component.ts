import { AmsShiftService } from '../../../services/ams/ams-shift.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs/Rx";
import { ToastyService } from "ng2-toasty";
import * as _ from "lodash";
import { TimeLogsLocation, TimeLogs } from '../../../models/time-logs';
import { Employee } from '../../../models/employee';
import { Model } from '../../../common/contracts/model';
import { DayEvent } from '../../../models/day-event';
import { Page } from '../../../common/contracts/page';
import { AmsAttendanceService } from '../../../services/ams/ams-attendance.service';
import { AmsTimelogsService } from '../../../services/ams/ams-timelogs.service';
import { AmsEmployeeService } from '../../../services/ams/ams-employee.service';
import { Angulartics2 } from 'angulartics2';
import { IGetParams } from '../../../common/contracts/api/get-params.interface';
import 'rxjs/Rx';
import { Http } from '@angular/http';


@Component({
  selector: 'aqua-attendance-logs',
  templateUrl: './attendance-logs.component.html',
  styleUrls: ['./attendance-logs.component.css']
})
export class AttendanceLogsComponent implements OnInit {
  employee: Model<Employee>;
  userType: string;
  logs: Page<TimeLogs>;
  attendances: Page<DayEvent>;
  timeLog: Model<TimeLogs>;
  subscription: Subscription;
  empId: string;
  ofDate: any;
  attendance: any;
  date: any;
  isButton = true;
  checkTime: Date;
  // checkStatus: any;


  constructor(private activatedRoute: ActivatedRoute,
    private toastyService: ToastyService,
    private amsAttendanceService: AmsAttendanceService,
    private amsTimelogsService: AmsTimelogsService,
    private shiftService: AmsShiftService,
    private angulartics2: Angulartics2,
    private http: Http,
    private amsEmployeeService: AmsEmployeeService) {
    this.employee = new Model({
      api: amsEmployeeService.employeesForAdmin,
      properties: new Employee()
    })
    this.timeLog = new Model({
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
        this.empId = params['empId'];
        this.ofDate = params['ofDate'];
        this.attendances.filters.properties['employee'].value = this.empId;
        this.attendances.filters.properties['ofDate'].value = new Date(this.ofDate).toISOString();
        this.logs.filters.properties['fromDate'].value = new Date(this.ofDate).toISOString();
        this.logs.filters.properties['employeeId'].value = this.empId;
        this.employee.fetch(this.empId).catch(err => this.toastyService.error({ title: 'Error', msg: err }));
        this.getAttendance();



        this.checkTime = new Date(this.ofDate);


      }
    )
    this.userType = localStorage.getItem('userType')

  }


  getLocation(latlng: number[], index: number) {
    let api: string = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latlng[1]},${latlng[0]}&key=AIzaSyA3-BQmJVYB6_soLJPv7cx2lFUMAuELlkM`;
    this.http.get(api).toPromise().then(data => {
      this.logs.items[index].location.address = data.json().results[0].formatted_address
    }).catch(err => {
      this.logs.items[index].location.address = 'N/A'
    });
  }

  getAttendance() {
    this.amsAttendanceService.attendance.get(`${new Date(this.ofDate).toISOString()}?employeeId=${this.empId}`).then(item => {
      this.attendance = item;

      const timeLogs: TimeLogs[] = this.attendance.timeLogs || [];

      this.attendance.timeLogs = timeLogs.sort((a, b) => b.time > a.time ? -1 : +1);

    });
    // this.attendances.fetch().then(
    //   (data) => {
    //     this.attendance = data.items[0];
    //     this.getLogs();
    //     if (this.attendance && this.attendance.shift) {
    //       this.shiftService.shifts.get(this.attendance.shift.id).then(shift => {
    //         this.employee.properties.shiftType = shift.shiftType;
    //       });
    //     }

    //   }).catch(err => this.toastyService.error({ title: 'Error', msg: err }));

  }



  getLogs() {
    this.logs.fetch().then(
      data => {
        _.each(this.logs.items, (log: TimeLogs, index) => {
          if (log.location && log.location.coordinates) {
            this.getLocation(log.location.coordinates, index);
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

  dateUpdated($event) {
    const date: Date = $event.target.valueAsDate;
    this.checkTime.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
  }

  timeUpdated($event) {
    const time = $event.target.value;
    let checkTimes: string[] = time.split(':');
    this.checkTime = new Date(new Date(this.checkTime).setHours(parseInt(checkTimes[0]), parseInt(checkTimes[1])));

  }

  checkUpdate() {
    let h: number, m: number;
    this.timeLog.properties.employee.id = this.empId;
    // let checkTimes: string[] = this.checkTime.split(':');
    this.timeLog.properties.time = this.checkTime.toISOString();
    // new Date(new Date(this.ofDate).setHours(parseInt(checkTimes[0]), parseInt(checkTimes[1]))).toISOString();
    this.timeLog.properties.source = 'byAdmin';
    this.timeLog.save().then(data => {
      this.toggleRow();
      this.getAttendance();
    }).catch(err => this.toastyService.error({ title: 'Error', msg: err }));

  }

  toggleRow() {
    this.angulartics2.eventTrack.next({ action: 'updateAttendanceClcik', properties: { category: 'timeLog' } });
    this.isButton = !this.isButton;
    // this.checkTime = this.ofDate;
    this.timeLog.properties = new TimeLogs();
  }

  toggleLocation(loc: TimeLogsLocation) {
    loc.show = !loc.show;
  }

  ngOnInit() {
  }

}
