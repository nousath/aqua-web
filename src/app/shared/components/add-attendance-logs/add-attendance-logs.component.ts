
import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastyService } from 'ng2-toasty';
import { Angulartics2 } from 'angulartics2';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Employee } from '../../../models/employee';
import { Model } from '../../../common/contracts/model';
import { TimeLogs, TimeLogsLocation } from '../../../models/time-logs';
import { Page } from '../../../common/contracts/page';
import { DayEvent } from '../../../models/day-event';
import { AmsAttendanceService, AmsTimelogsService, AmsShiftService, AmsEmployeeService } from '../../../services/index';
import { Http } from '@angular/http';
// import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { Attendance } from '../../../models/daily-attendance';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'aqua-add-attendance-logs',
  templateUrl: './add-attendance-logs.component.html',
  styleUrls: ['./add-attendance-logs.component.css']
})
export class AddAttendanceLogsComponent {

  employee: Model<Employee>;
  userType: string;
  logs: Page<TimeLogs>;
  attendances: Page<DayEvent>;
  timeLog: Model<TimeLogs>;
  empId: string;
  ofDate: any;
  attendance: DayEvent;
  date: any;
  checkedDate: boolean = true;
  isButton = true;
  checkTime: Date;
  attendanceLogs = [];
  extraShiftCount = 0;
  nextDayIn = false;
  nextDayOut = false;
  paramsId: string;
  paramsDate: Date;
  currentDate: Date;
  addAttendanceLogs = [{
    day: false,
    time: '',
    type: ''
  }];

  inTime: any;
  outTime: '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private toastyService: ToastyService,
    private amsAttendanceService: AmsAttendanceService,
    private amsTimelogsService: AmsTimelogsService,
    private shiftService: AmsShiftService,
    private angulartics2: Angulartics2,
    private http: Http,
    private amsEmployeeService: AmsEmployeeService,
    public dialogRef: MdDialogRef<AddAttendanceLogsComponent>,
    @Inject(MD_DIALOG_DATA) public data: Attendance) {


    console.log('data', this.data);

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

    this.addAttendanceLogs = [{
      'day': false,
      'time': null,
      'type': 'checkIn'
    }, {
      'day': false,
      'time': null,
      'type': 'checkOut'
    }];


    this.activatedRoute.params.subscribe(
      params => {
        this.paramsId = params['empId'];
        this.paramsDate = params['ofDate'];
      })
    if (this.paramsId && this.paramsDate) {
      this.empId = this.paramsId
      this.ofDate = this.paramsDate
    } else {
      console.log(this.data.id)
      this.empId = this.data.employee.id
      this.ofDate = this.data.ofDate
    }
    this.attendances.filters.properties['employee'].value = this.empId;
    this.attendances.filters.properties['ofDate'].value = new Date(this.ofDate).toISOString();
    this.logs.filters.properties['fromDate'].value = new Date(this.ofDate).toISOString();
    this.logs.filters.properties['employeeId'].value = this.empId;
    this.employee.fetch(this.empId).catch(err => this.toastyService.error({ title: 'Error', msg: err }));
    this.getAttendance();

    this.checkTime = new Date(this.ofDate);
    this.currentDate = new Date();
    console.log(this.currentDate);
  }

  getLocation(latlng: number[], index: number) {
    const api = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latlng[1]},${latlng[0]}&key=AIzaSyA3-BQmJVYB6_soLJPv7cx2lFUMAuELlkM`;
    this.http.get(api).toPromise().then(data => {
      this.logs.items[index].location.address = data.json().results[0].formatted_address
    }).catch(err => {
      this.logs.items[index].location.address = 'N/A'
    });
  }

  getAttendance() {

    console.log('get' + this.data)
    this.amsAttendanceService.attendance.get(`${new Date(this.ofDate).toISOString()}?employeeId=${this.empId}`).then(item => {
      this.attendance = item;

      const timeLogs: TimeLogs[] = this.attendance.timeLogs || [];

      this.attendance.timeLogs = timeLogs.sort((a, b) => b.time > a.time ? -1 : +1);

      const shiftType = this.attendance.shift.shiftType;

      let shiftSpan = 0
      if (shiftType && shiftType.endTime && shiftType.startTime) {
        const endTime = new Date(shiftType.endTime).getTime()
        let startTime = new Date(shiftType.startTime).getTime()

        if (startTime > endTime) {
          startTime = startTime - 24 * 60 * 60 * 1000; // hrs
        }
        shiftSpan = endTime - startTime;

      }

      let workSpan = 0
      if (this.attendance.checkOut && this.attendance.checkIn) {
        workSpan = new Date(this.attendance.checkOut).getTime() - new Date(this.attendance.checkIn).getTime();
      }

      if (shiftSpan) {
        this.extraShiftCount = (workSpan / shiftSpan) - 1

        if (this.extraShiftCount < 0) {
          this.extraShiftCount = 0
        } else {
          this.extraShiftCount = parseInt(this.extraShiftCount.toFixed(0))
        }
      }
    }).catch();
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

  updateLogs() {
    this.addAttendanceLogs.forEach(item => {
      if (item.time) {
        const time = item.time
        const checkTimes: string[] = time.split(':');
        if (item.day === true) {

          this.checkTime = new Date(new Date(this.checkTime).setHours(parseInt(checkTimes[0]), parseInt(checkTimes[1])));
          this.checkTime = moment(this.checkTime).add(1, 'day').toDate()
          console.log('check' + this.checkTime)
        } else {
          this.checkTime = new Date(new Date(this.checkTime).setHours(parseInt(checkTimes[0]), parseInt(checkTimes[1])));
          this.checkTime = moment(this.checkTime).utc().toDate()
          console.log('uncheck' + this.checkTime)

        }
        this.timeLog.properties.employee.id = this.empId;
        this.timeLog.properties.time = this.checkTime;
        this.timeLog.properties.type = item.type;
        this.timeLog.properties.source = 'byAdmin';
        this.timeLog.save().then(data => {
          this.getAttendance();
        }).catch(err => this.toastyService.error({ title: 'Error', msg: err }));

      }
      item.time = null
    })
    console.log(this.addAttendanceLogs)
  }

  addNewRow() {
    this.addAttendanceLogs.push({
      day: false,
      time: null,
      type: 'checkIn'
    }, {
        day: false,
        time: null,
        type: 'checkOut'
      })
  }



  toggleLocation(loc: TimeLogsLocation) {
    loc.show = !loc.show;
  }

  ngOnInit() {
  }

}
