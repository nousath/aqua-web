import { Shift } from './shift';
import { TimeLogs } from '.';

export class DayEvent {
  id: string;
  date: Date;

  color: string;
  action: string;
  status: string;
  style: string;

  checkIn: Date;
  checkInStatus: string;
  checkOut: Date;
  checkOutStatus: string;

  hoursWorked: number;
  count: number;
  isContinue: boolean;
  shift: Shift = new Shift();
  timeLogs: TimeLogs[];

  checkOutExtend: boolean;
  checkInExtend: boolean;

  constructor(obj?: any) {
    if (!obj) {
      return;
    }

    this.id = obj.id;
    this.date = obj.date;
    this.color = obj.color;
    this.action = obj.action;
    this.status = obj.status;
    this.style = obj.style;

    this.checkIn = obj.checkIn;
    this.checkInStatus = obj.checkInStatus;

    this.checkOut = obj.checkOut;
    this.checkOutStatus = obj.checkOutStatus;

    this.hoursWorked = obj.hoursWorked;
    this.count = obj.count;

    this.shift = obj.shift;
    this.checkOutExtend = !!obj.checkOutExtend;
    this.checkInExtend = !!obj.checkInExtend;
    this.isContinue = !!obj.isContinue;
  }
}

