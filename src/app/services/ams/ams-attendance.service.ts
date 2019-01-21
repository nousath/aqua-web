import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { IApi } from '../../common/ng-api/api.interface';
import { MonthAttendance, DailyAttendance, DayEvent, Attendance } from '../../models';
import { GenericApi } from '../../common/ng-api/generic-api';
import { DatesService } from '../../shared/services';
import * as moment from 'moment';
import { LeaveSummary } from './ams-leave.service';


export class AttendanceSummary {
  code: string;
  first: string;
  second: string;
  count: number;
  // clocked: string;
  //  minutes: number;
  late: number; // minutes
  early: number; // minutes
  attendance: Attendance;
  status: string;
}
@Injectable()
export class AmsAttendanceService {

  monthlyAttendances: IApi<MonthAttendance>;
  dailyAttendances: IApi<Attendance>;
  teamMember: IApi<DailyAttendance>;

  donwloadMonthlyAttendances: IApi<any>;
  donwloadDailyAttendances: IApi<any>;
  donwloadSingleEmpMonthAtte: IApi<any>;
  extendShift: IApi<any>;



  attendance: IApi<Attendance>;

  constructor(
    http: Http,
    private dates: DatesService
  ) {
    const baseApi = 'ams';
    const id = '';
    this.attendance = new GenericApi<Attendance>('attendances', http, baseApi);
    this.monthlyAttendances = new GenericApi<MonthAttendance>('attendances/employee/month/summary', http, baseApi);
    this.dailyAttendances = new GenericApi<Attendance>('attendances/getOneDayAttendances', http, baseApi);
    this.teamMember = new GenericApi<any>(`teams/${id}/teamMembers`, http, baseApi);
    this.donwloadMonthlyAttendances = new GenericApi<any>('attendances/extractor', http, baseApi);
    this.donwloadDailyAttendances = new GenericApi<any>('attendances/dayReport', http, baseApi);
    this.donwloadSingleEmpMonthAtte = new GenericApi<any>('attendances/monthReport', http, baseApi);
    this.extendShift = new GenericApi<any>(`attendances/${id}/extendShift`, http, baseApi);
  }

  getSummary = (attendance: Attendance, leaveSummary: LeaveSummary): AttendanceSummary => {
    const dayStatus = new AttendanceSummary();

    if (!attendance) {
      return dayStatus
    }

    dayStatus.attendance = attendance
    const shiftType = attendance.shift.shiftType
    dayStatus.code = shiftType.code

    // dayStatus.minutes = clockedMinutes(attendance, context)

    // let hours = dayStatus.minutes / 60

    // hours = parseInt(hours.toFixed(2))
    // let minutes = dayStatus.minutes - hours * 60

    // if (hours === 0) {
    //     hours = '00'
    // } else if (hours < 10) {
    //     hours = `0${hours}`
    // }

    // if (minutes === 0) {
    //     minutes = '00'
    // } else if (minutes < 10) {
    //     minutes = `0${minutes}`
    // }

    // dayStatus.clocked = `${hours}:${minutes}`

    if (attendance.checkOut && this.dates.time(attendance.checkOut).lt(shiftType.endTime)) {
      dayStatus.early = this.dates.time(attendance.checkOut).diff(shiftType.endTime) / 60
    }

    if (attendance.checkIn && this.dates.time(attendance.checkIn).gt(shiftType.startTime)) {
      dayStatus.late = this.dates.time(attendance.checkIn).diff(shiftType.startTime) / 60
    }

    let endTime = this.dates.date(attendance.ofDate).setTime(shiftType.endTime)
    const startTime = this.dates.date(attendance.ofDate).setTime(shiftType.startTime)

    if (startTime.getTime() > endTime.getTime()) {
      endTime = moment(endTime).add(1, 'day').toDate()
    }

    const shiftSpan = this.dates.time(endTime).diff(startTime) / 60

    let workSpan = 0
    if (attendance.checkOut && attendance.checkIn) {
      workSpan = this.dates.time(attendance.checkOut).diff(attendance.checkIn) / 60
    }

    dayStatus.count = (workSpan / shiftSpan)

    if (dayStatus.count < 0) {
      dayStatus.count = 0
    }

    dayStatus.count.toFixed(2)

    dayStatus.status = attendance.status
    dayStatus.first = 'A'
    dayStatus.second = 'A'

    if (leaveSummary.code) {
      dayStatus.status = 'onLeave'
      if (leaveSummary.first) {
        dayStatus.first = leaveSummary.code
      }
      if (leaveSummary.second) {
        dayStatus.second = leaveSummary.code
      }
    }

    if (dayStatus.status === 'absent') {
      if (attendance.checkIn && attendance.checkOut) {
        dayStatus.status = 'present'
        dayStatus.first = 'P'
        dayStatus.second = 'P'
      }
    }

    if (attendance.checkIn && attendance.checkIn > startTime) {
      const late = this.dates.time(attendance.checkIn).diff(startTime) / 60
      if (late > shiftSpan / 4) {
        dayStatus.first = 'A'
      }
    }

    if (attendance.checkOut && attendance.checkOut < endTime) {
      const early = this.dates.time(attendance.checkOut).diff(endTime) / 60
      if (early > shiftSpan / 4) {
        dayStatus.second = 'A'
      }
    }

    return dayStatus
  }
}
