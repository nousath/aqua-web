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

  error: string;

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
        this.enableControls('duration');
      } else if (this.limit === 1) {
        this.enable.durations.single = true;
        this.duration = 'single';
        this.enableControls('duration');
      } else if (this.limit < 1) {
        this.duration = 'half';
        this.enableControls('duration');
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

  enableControls(controlId?: string) {
    switch (this.duration) {
      case 'multi':
        this.enable.start.first = true;
        this.enable.end.second = true;

        this.enable.end.first = false;
        this.enable.start.second = false;

        if (controlId === 'duration') {
          this.leave.start.first = true;
          this.leave.start.second = true;
          this.leave.end.first = true;
          this.leave.end.second = true;
        }

        this.enable.end.date = !!this.leave.date

        break;

      case 'single':
        this.enable.start.first = false;
        this.enable.start.second = false;
        this.enable.end.first = false;
        this.enable.end.second = false;
        this.enable.end.date = false;

        if (controlId === 'duration') {
          this.leave.start.first = true;
          this.leave.start.second = true;
        }

        break;

      case 'half':
        this.enable.start.first = true;
        this.enable.start.second = true;
        this.enable.end.first = false;
        this.enable.end.second = false;
        this.enable.end.date = false;

        if (controlId === 'duration') {
          this.leave.start.first = true;
          this.leave.start.second = false;
        }

        if (controlId === 'start.first') {
          this.leave.start.second = !this.leave.start.first;
        } else if (controlId === 'start.second') {
          this.leave.start.first = !this.leave.start.second;
        }

        break;

      case 'oneThird':
        this.enable.start.first = true;
        this.enable.start.second = true;
        this.enable.end.first = false;
        this.enable.end.second = false;
        this.enable.end.date = false

        if (controlId === 'duration') {
          this.leave.start.first = true;
          this.leave.start.second = false;
        }

        if (controlId === 'start.first') {
          this.leave.start.second = !this.leave.start.first;
        } else if (controlId === 'start.second') {
          this.leave.start.first = !this.leave.start.second;
        }

        break;

      case 'twoThird':
        this.enable.start.first = true;
        this.enable.start.second = true;
        this.enable.end.first = false;
        this.enable.end.second = false;
        this.enable.end.date = false;

        if (controlId === 'start.first') {
          this.leave.start.second = !this.leave.start.first;
        } else if (controlId === 'start.second') {
          this.leave.start.first = !this.leave.start.second;
        }

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

  changed(controlId?: string) {
    this.error = null;
    this.enableControls(controlId);
    this.leave.days = 0;

    switch (this.duration) {

      case 'multi':
        this.canCreate = !!this.leave.date && !!this.leave.toDate;
        if (this.leave.toDate <= this.leave.date) {
          this.canCreate = false;
          this.error = 'Till Date needs to be after From Date';
        }
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

    if (this.type.monthlyLimit && this.leave.days > this.type.monthlyLimit) {
      this.canCreate = false;
      this.error = `There is a capping of '${this.type.monthlyLimit}' day(s)`;
    } else if (!this.type.unlimited && this.leave.days > this.balance.days) {
      this.canCreate = false;
      this.error = `You cannot apply more that '${this.balance.days}' day(s)`;
    }

    if (this.canCreate) {
      this.leave.employee = this.employee;
      this.onChange.emit(this.leave);
    } else {
      this.onChange.emit(null);
    }
  }
}
