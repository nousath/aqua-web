import { AmsShiftService } from '../../../services/ams/ams-shift.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { ToastyService } from 'ng2-toasty';
import * as moment from 'moment';
import * as _ from 'lodash';
import { TimeLogsLocation, TimeLogs } from '../../../models/time-logs';
import { Employee } from '../../../models/employee';
import { Model } from '../../../common/contracts/model';
import { DayEvent } from '../../../models/day-event';
import { Page } from '../../../common/contracts/page';
import { AmsAttendanceService } from '../../../services/ams/ams-attendance.service';
import { AmsTimelogsService } from '../../../services/ams/ams-timelogs.service';
import { AmsEmployeeService } from '../../../services/ams/ams-employee.service';
import { Angulartics2 } from 'angulartics2';
import { Http } from '@angular/http';
import { Location } from '@angular/common';
import { MdDialogRef, MdDialog } from '@angular/material';
import { BulkTimeLogsDialogComponent } from '../../../shared/components/bulk-time-logs-dialog/bulk-time-logs-dialog.component';
import { EmsAuthService } from '../../../services/ems/ems-auth.service';

@Component({
  selector: 'aqua-attendance-logs',
  templateUrl: './attendance-logs.component.html',
  styleUrls: ['./attendance-logs.component.css']
})
export class AttendanceLogsComponent implements OnInit {
  employee: Model<Employee>;
  logs: Page<TimeLogs>;
  attendances: Page<DayEvent>;
  timeLog: Model<TimeLogs>;
  subscription: Subscription;
  empId: string;
  ofDate = new Date();
  attendance: DayEvent;
  date: any;
  isButton = true;
  checkTime: Date;
  logsSource = false;
  attendanceLogs = [];
  extraShiftCount = 0;
  nextDayIn = false;
  nextDayOut = false;
  paramsId: string;
  paramsDate: Date;
  checkedDate = true;
  timeLogsLength = 1;
  index = 1
  addAttendanceLogs = [{
    day: false,
    time: '',
    type: ''
  }];

  isProcessing = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private toastyService: ToastyService,
    private amsAttendanceService: AmsAttendanceService,
    private amsTimelogsService: AmsTimelogsService,
    private shiftService: AmsShiftService,
    private http: Http,
    private router: Router,
    private amsEmployeeService: AmsEmployeeService,
    public auth: EmsAuthService,
    public _location: Location,
    public dialog: MdDialog) {
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
      filters: ['employee', 'ofDate']
    })
    this.logs = new Page({
      api: amsTimelogsService.timeLogs,
      filters: ['employeeId', 'fromDate']
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

    this.empId = this.activatedRoute.snapshot.params['empId']
    if (this.activatedRoute.snapshot.queryParams['ofDate']) {
      this.ofDate = new Date(this.activatedRoute.snapshot.queryParams['ofDate'])
    }
    this.activatedRoute.params.subscribe(params => {
      this.empId = params['empId'];
      this.setData()
    })

    this.activatedRoute.queryParams.subscribe(query => {
      this.ofDate = query['ofDate'] ? new Date(query['ofDate']) : new Date();
      this.setData();
    })

    this.setData();
  }

  setData() {
    this.attendances.filters.properties['employee'].value = this.empId;
    this.attendances.filters.properties['ofDate'].value = new Date(this.ofDate).toISOString();
    this.logs.filters.properties['fromDate'].value = new Date(this.ofDate).toISOString();
    this.logs.filters.properties['employeeId'].value = this.empId;
    this.employee.fetch(this.empId).catch(err => this.toastyService.error({ title: 'Error', msg: err }));
    this.getAttendance();

    this.checkTime = new Date(this.ofDate);
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

    this.isProcessing = true;

    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { ofDate: this.ofDate.toISOString() },
      queryParamsHandling: 'merge',
    });

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

      this.timeLogsLength = this.attendance.timeLogs.length;

      if (this.attendance && this.attendance.timeLogs && this.timeLogsLength !== 0 && this.attendance.isContinue) {
        this.logsSource = true;
      }
      if (shiftSpan) {
        this.extraShiftCount = (workSpan / shiftSpan) - 1

        if (this.extraShiftCount < 0) {
          this.extraShiftCount = 0
        } else {
          this.extraShiftCount = parseInt(this.extraShiftCount.toFixed(0))
        }
      }

      this.isProcessing = false;
    }).catch(() => {
      this.isProcessing = false;
    });
    this.logsSource = false;
  }

  getLogs() {
    this.logs.fetch().then(data => {
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
        } else {
          this.checkTime = new Date(new Date(this.checkTime).setHours(parseInt(checkTimes[0]), parseInt(checkTimes[1])));
          this.checkTime = moment(this.checkTime).utc().toDate()

        }
        this.timeLog.properties.employee.id = this.empId;
        this.timeLog.properties.time = this.checkTime;
        this.timeLog.properties.type = item.type;
        this.timeLog.properties.source = 'byAdmin';
        this.timeLog.save().then(data => {
          this.getAttendance();
        }).catch(err => this.toastyService.error({ title: 'Error', msg: err }));

      }
    })
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

  showNextDate() {

    const nextDate = moment(this.ofDate).add(1, 'd').toDate();

    if (nextDate < new Date()) {
      this.ofDate = nextDate;
      this.getAttendance();
    } else {
      this.toastyService.info({ title: 'Max Date', msg: `You cannot browse to future date` })
    }

  }

  showPreviousDate() {
    this.ofDate = moment(this.ofDate).subtract(1, 'd').toDate();
    this.getAttendance();
  }

  canMoveNext(item: TimeLogs) {
    const diff = moment(this.ofDate).diff(moment(item.time), 'h')
    return diff <= 12;
  }

  canMovePrevious(item: TimeLogs) {
    const diff = moment(this.ofDate).diff(moment(item.time), 'h')
    return diff >= -12;
  }

  moveNext(item: TimeLogs) {
    const date = moment(this.ofDate).add(1, 'd').toISOString()
    this.amsTimelogsService.timeLogs.simplePost({
      from: {
        id: this.attendance.id
      },
      to: {
        ofDate: date
      },
      timeLog: item
    }, 'move').then(() => {
      this.getAttendance();
      this.toastyService.info({ title: 'Time Log', msg: `moved to ${moment(date).format('DD-MM-YYYY')}` })
    })
  }

  movePrevious(item: TimeLogs) {
    const date = moment(this.ofDate).subtract(1, 'd').toISOString()
    this.amsTimelogsService.timeLogs.simplePost({
      from: {
        id: this.attendance.id
      },
      to: {
        ofDate: date
      },
      timeLog: item
    }, 'move').then(() => {
      this.getAttendance();
      this.toastyService.info({ title: 'Time Log', msg: `moved to ${moment(date).format('DD-MM-YYYY')}` })
    })
  }

  addLogs() {
    const dialogRef: MdDialogRef<BulkTimeLogsDialogComponent> = this.dialog.open(BulkTimeLogsDialogComponent, {
      panelClass: 'app-full-bleed-dialog',
      width: '50%',
      height: '50%',
      data: {
        empCode: this.employee.properties.code
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAttendance()
      }
    });
  }

  ngOnInit() {
  }
  backClicked() {
    this._location.back();
  }
}
