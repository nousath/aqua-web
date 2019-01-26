import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { DayEvent, Shift } from '../../../models';
import { Attendance } from '../../../models/daily-attendance';
import { DatesService } from '../../services/dates.service';
import { Router } from '@angular/router';
import { Employee } from '../../../models/employee';
import { AmsAttendanceService } from '../../../services/ams/ams-attendance.service';
import { ToastyService } from 'ng2-toasty';
import { EmsAuthService } from '../../../services/ems/ems-auth.service';
import { PageOptions } from '../../../common/ng-api';

@Component({
  selector: 'aqua-calendar-view',
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.css']
})
export class CalendarViewComponent implements OnInit, OnChanges {

  @Input()
  employee: Employee;

  @Input()
  month: Date;

  isProcessing = false;

  events: DayEvent[] = [];
  emptyStartDays: any[] = [];
  emptyEndDays: any[] = [];

  days: string[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  monthDays: number[] = []

  firstDay: Date;
  lastDay: Date;

  constructor(
    private dateService: DatesService,
    private amsAttendanceService: AmsAttendanceService,
    private toastyService: ToastyService,
    public auth: EmsAuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.fetch();
  }
  ngOnChanges(changes: SimpleChanges) {
    this.fetch();
  }

  renderAttendance(attendances: Attendance[]) {
    const year = this.month.getFullYear();
    const monthInNumber = this.month.getMonth();

    this.events = [];
    this.monthDays.forEach(day => {
      const attendance = attendances.find(item => {
        return new Date(item.ofDate).getDate() === day + 1;
      });

      if (attendance) {
        // if (!attendance.shift) {
        //   attendance['shift'] = new Shift();
        //   attendance.shift.status = 'working';
        // }
        // attendance.status = attendance.status ? attendance.status.toLowerCase() : '';
        // attendance.shift.status = attendance.shift.status ? attendance.shift.status.toLowerCase() : '';

        let status = '';
        let action = '';
        let style = 'default';
        switch (attendance.status) {
          case 'onLeave':
            status = 'Leave';
            style = 'info';
            // TODO: show leave type
            // switch (attendance.leave.type.category) {

            // }
            break;
          case 'absent':
            switch (attendance.shift.status) {
              case 'working':
                status = 'Absent';
                action = 'Apply Leave'
                style = 'error';
                break;
              case 'weekOff':
                status = 'Off';
                style = 'inactive';

                break;
              case 'holiday':
                status = attendance.shift.holiday.name || 'Holiday';
                style = 'inactive';
                break;
            }
            break;
          case 'weekOff':
            status = 'Off';
            style = 'inactive';
            break;

          case 'holiday':
            status = attendance.shift.holiday.name || 'Holiday';
            style = 'inactive';
            break;

          case 'present':
            status = 'Present';
            style = 'active';
            break;

          case 'checkedIn':
            status = 'Present';
            style = 'active';
            break;
          case 'checked-in-again':
            status = 'Present';
            style = 'active';
            break;
        }

        let systemCheckIn = false;
        let systemCheckOut = false;

        if (attendance.timeLogs && attendance.timeLogs.length) {
          systemCheckIn = !!attendance.timeLogs.find(item => item.type === 'checkIn' && item.source === 'system')
          systemCheckOut = !!attendance.timeLogs.find(item => item.type === 'checkOut' && item.source === 'system')
        }

        this.events.push(new DayEvent({
          id: attendance.id,
          date: attendance.ofDate,
          status: status,
          style: style,
          action: action,

          checkIn: attendance.checkIn,
          checkInStatus: attendance.checkInStatus,
          checkInExtend: systemCheckIn,

          checkOut: attendance.checkOut,
          checkOutStatus: attendance.checkOutStatus,
          checkOutExtend: attendance.checkOutExtend,
          isContinue: systemCheckOut,

          count: attendance.count,
          color: attendance.shift.shiftType.color
        }))
      } else {
        this.events.push(new DayEvent({
          date: new Date(year, monthInNumber, day + 1)
        }));
      }
    })
  }

  renderMonth() {
    this.firstDay = this.dateService.date(this.month).bom()
    this.lastDay = this.dateService.date(this.month).eom()

    const year = this.month.getFullYear();
    const monthInNumber = this.month.getMonth();

    this.emptyStartDays = [];
    let startDay = this.firstDay.getDay();
    startDay = startDay === 0 ? 7 : startDay;
    for (let i = 1; i < startDay; i++) {
      this.emptyStartDays.push(i);
    }

    this.monthDays = [];
    for (let i = 0; i < this.lastDay.getDate(); i++) {
      this.monthDays.push(i);
    }

    this.events = [];
    this.monthDays.forEach(day => {
      this.events.push(new DayEvent({
        date: new Date(year, monthInNumber, day + 1)
      }));
    });
  }
  fetch() {
    this.renderMonth();
    const pageOptions = new PageOptions();
    pageOptions.query['fromDate'] = this.firstDay.toISOString();
    pageOptions.query['toDate'] = this.dateService.date(this.lastDay).nextBod().toISOString();
    pageOptions.query['employee'] = this.employee.id;

    this.isProcessing = true;
    this.amsAttendanceService.attendance.search(pageOptions).then((data) => {
      this.renderAttendance(data.items);
      this.isProcessing = false;
    }).catch(err => {
      this.isProcessing = false;
      this.toastyService.error({ title: 'Error', msg: err });
    });
  }

  updateDayEvent(item: DayEvent) {
    const date = this.dateService.date(item.date)
    if (!date.isFuture()) {
      this.router.navigate([`/attendances/${this.employee.id}/logs`], {
        queryParams: {
          ofDate: date.serialize()
        }
      })
    }
  }

  regenerate() {
    const model = {
      employee: this.employee,
      period: 'month',
      date: this.month.toISOString()
    }
    this.amsAttendanceService.attendance.simplePost(model, 'regenerate').then(() => {
      this.toastyService.info({ title: 'Info', msg: 'Request is submitted. Kindly reload' })
    })
  }
}
