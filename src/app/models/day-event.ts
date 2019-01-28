import { Attendance } from './daily-attendance';

export class DayEvent extends Attendance {

  color: string;
  action: string;
  style: string;

  isCheckOutExtend: boolean;
  isCheckInExtend: boolean;
}

