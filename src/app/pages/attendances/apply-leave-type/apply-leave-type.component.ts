import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Leave } from '../../../models/leave';
import { LeaveBalance } from '../../../models/leave-balance';
import { LeaveType } from '../../../models';
import { ToastyService } from 'ng2-toasty';
import { Employee } from '../../../models/employee';
import * as moment from 'moment';
import { DatesService } from '../../../shared/services';

@Component({
  selector: 'aqua-apply-leave-type',
  templateUrl: './apply-leave-type.component.html',
  styleUrls: ['./apply-leave-type.component.css']
})
export class ApplyLeaveTypeComponent implements OnInit {


  startDate = ''
  endDate = ''
  days: number;

  @Input()
  balance: LeaveBalance;

  @Input()
  type: LeaveType;

  @Input()
  employee: Employee;

  @Input()
  message: string;

  @Output() onChange: EventEmitter<Leave> = new EventEmitter();

  leave: Leave;

  duration: string;

  enable = {
    start: {
      date: false,
      first: true,
      second: true
    },
    end: {
      date: false,
      first: true,
      second: true
    },
    durations: {
      multi: false,
      single: false,
      half: false,
      oneThird: false,
      twoThird: false
    }
  };

  canCreate = false;


  limitLabel: string;
  limit: number;

  constructor(
    private toastyService: ToastyService,
    private dates: DatesService
  ) { }

  ngOnInit(): void {
    this.limit = -1;
    this.type = this.type || this.balance.leaveType;
    if (this.type.unlimited) {
      if (this.type.monthlyLimit) {
        this.limit = this.type.monthlyLimit;
        this.limitLabel = `${this.limit} day(s)`;
      }
    } else {
      if (this.type.monthlyLimit) {
        if (this.balance.days < this.type.monthlyLimit) {
          this.limit = this.balance.days;
          this.limitLabel = `${this.limit} day(s)`;
        } else {
          this.limit = this.type.monthlyLimit
          this.limitLabel = `${this.limit} of ${this.balance.days} day(s))`;
        }
      } else {
        this.limit = this.balance.days;
        this.limitLabel = `${this.limit} day(s)`;
      }
    }

    if (this.limit === 0) {
      this.limitLabel = `out of stock`;
    }

    this.leave = new Leave();
    this.leave.leaveType = this.type;

    this.leave.start = {
      first: true,
      second: true
    };

    this.leave.end = {
      first: true,
      second: true
    };

    if (this.limit !== 0) {
      this.enable.start.date = true;

      if (this.limit > 1) {
        this.enable.durations.multi = true;
        this.enable.durations.single = true;
        this.duration = 'single';
      } else if (this.limit === 1) {
        this.enable.durations.single = true;
        this.duration = 'single';
      } else if (this.limit < 1) {
        this.duration = 'half';
      }

      if (this.type.unitsPerDay === 2) {
        this.enable.durations.half = true;
      }

      if (this.type.unitsPerDay === 3) {
        this.enable.durations.oneThird = true;
        this.enable.durations.twoThird = true;
      }

      if (this.type.unitsPerDay === 6) {
        this.enable.durations.oneThird = true;
        this.enable.durations.twoThird = true;
        this.enable.durations.half = true;
      }
    }
  }

  enableControls() {
    switch (this.duration) {

      case 'multi':
        this.enable.start.first = true;
        this.enable.end.second = true;

        this.enable.end.first = false;
        this.enable.start.second = false;
        this.leave.start.second = true;
        this.leave.end.first = true;

        this.enable.end.date = !!this.leave.date

        break;

      case 'single':
        this.enable.start.first = false;
        this.enable.start.second = false;
        this.enable.end.first = false;
        this.enable.end.second = false;
        this.enable.end.date = false;

        break;

      case 'half':
        this.enable.start.first = true;
        this.enable.start.second = true;
        this.enable.end.first = false;
        this.enable.end.second = false;
        this.enable.end.date = false

        break;

      case 'oneThird':
        this.enable.start.first = true;
        this.enable.start.second = true;
        this.enable.end.first = false;
        this.enable.end.second = false;
        this.enable.end.date = false

        break;

      case 'twoThird':
        this.enable.start.first = true;
        this.enable.start.second = true;
        this.enable.end.first = false;
        this.enable.end.second = false;
        this.enable.end.date = false

        break;
    }
  }

  startDateChanged() {
    if (!this.startDate) {
      this.leave.date = null;
    }

    this.leave.date = moment(this.startDate).toDate();

    this.changed()
  }

  endDateChanged() {
    if (!this.endDate) {
      this.leave.toDate = null;
    }

    this.leave.toDate = moment(this.endDate).toDate();
    this.changed();
  }

  changed() {

    this.enableControls();
    this.leave.days = 0;

    switch (this.duration) {

      case 'multi':
        this.canCreate = !!this.leave.date && !!this.leave.toDate;
        this.leave.start.first = this.leave.start.first;
        this.leave.start.second = this.leave.start.second;
        this.leave.end.first = this.leave.end.first;
        this.leave.end.second = this.leave.end.second;

        if (this.canCreate) {
          this.leave.days = this.dates.date(this.leave.toDate).diff(this.leave.date);

          if (!this.leave.start.first) {
            this.leave.days = this.leave.days - 0.5;
          }

          if (!this.leave.end.second) {
            this.leave.days = this.leave.days - 0.5;
          }
        }
        break;

      case 'single':
        this.canCreate = !!this.leave.date;
        this.leave.days = 1;
        break;

      case 'twoThird':
        this.canCreate = !!this.leave.date && ((!this.leave.start.first && this.leave.start.second) || (this.leave.start.first && !this.leave.start.second))
        this.leave.days = 2 / 3;

        this.leave.start.first = this.leave.start.first;
        this.leave.start.second = this.leave.start.second;

        break;

      case 'half':
        this.canCreate = !!this.leave.date && ((!this.leave.start.first && this.leave.start.second) || (this.leave.start.first && !this.leave.start.second))
        this.leave.days = 1 / 2;
        this.leave.start.first = this.leave.start.first;
        this.leave.start.second = this.leave.start.second;

        break;

      case 'oneThird':
        this.canCreate = !!this.leave.date && ((!this.leave.start.first && this.leave.start.second) || (this.leave.start.first && !this.leave.start.second))
        this.leave.days = 1 / 3;
        this.leave.start.first = this.leave.start.first;
        this.leave.start.second = this.leave.start.second;

        break;
    }

    if (this.canCreate) {
      this.leave.employee = this.employee;
      this.onChange.emit(this.leave);
    } else {
      this.onChange.emit(null);
    }



    // if (this.startDate && this.endDate) {
    //   const oneDay = 24 * 60 * 60 * 1000;
    //   const startDay: Date = new Date(this.startDate);
    //   if (this.startFirstHalf && this.startSecondHalf)
    //     startDay.setHours(0, 0, 0, 0);
    //   else if (this.endFirstHalf)
    //     startDay.setHours(12, 0, 0, 0);
    //   else if (this.endSecondHalf)
    //     startDay.setHours(12, 0, 0, 0);
    //   else
    //     return this.toastyService.info({ title: 'Info', msg: 'Select Half' })

    //   const endDay: Date = new Date(this.endDate);

    //   if (this.endFirstHalf && this.endSecondHalf)
    //     endDay.setHours(0, 0, 0, 0);
    //   else if (this.endFirstHalf)
    //     endDay.setHours(12, 0, 0, 0);
    //   else if (this.endSecondHalf)
    //     endDay.setHours(12, 0, 0, 0);
    //   else
    //     return this.toastyService.info({ title: 'Info', msg: 'Select Half' })

    //   if (endDay <= startDay) {
    //     return this.toastyService.info({ title: 'Info', msg: 'End Date should be greater then Start Date' })
    //   }
    //   if ((this.endFirstHalf && this.endSecondHalf) && (this.startFirstHalf && this.startSecondHalf)) {
    //     this.days = Math.abs(((endDay.getTime() - startDay.getTime()) / (oneDay)) + 1);
    //   } else {
    //     this.days = Math.abs(((endDay.getTime() - startDay.getTime()) / (oneDay)) + 1);
    //   }

    //   if (this.days > this.balance.days && !this.balance.leaveType.unlimited) {
    //     return this.toastyService.info({ title: 'Info', msg: `You don't have sufficient leave balance` })
    //   }

    //   if (this.balance.leaveType.monthlyLimit && this.days > this.balance.leaveType.monthlyLimit) {
    //     return this.toastyService.info({ title: 'Info', msg: `You cannot apply more than ${this.balance.leaveType.monthlyLimit} in a month` })
    //   }
    //   const selectedLeave: any = {
    //     id: this.balance.id,
    //     type: this.balance.leaveType,
    //     start: this.startDate,
    //     end: this.endDate,
    //     days: this.days
    //   }

    //   this.bulkLeaves = selectedLeave
    //   console.log(this.bulkLeaves)

    //   this.onChange.emit(this.leave);
    // }
  }

}
