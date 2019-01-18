import { ShiftType } from './shift-type';
import { Shift } from './shift';
import { Employee } from './employee';
import { TimeLogs } from './time-logs';
export class DailyAttendance {
  id = '';
  name = '';
  code = '';
  designation = '';
  picData = '';
  picUrl = '';
  email = '';
  // leaveBalances: number = null;
  // shiftType: ShiftType = new ShiftType();
  attendance: Attendance = new Attendance();
}

export enum AttendanceStates {
  absent,
  checkedIn,
  'checked-in-again',
  present,
  onLeave,
  halfday,
  weekOff,
  holiday
}

export class Attendance {
  id: string;
  ofDate: Date;
  status: string;
  checkIn: Date;
  checkOut: Date;
  checkOutExtend: string;
  hoursWorked: number;
  minsWorked: number;
  needsAction: string;
  checkInStatus: string;
  checkOutStatus: string;
  isContinue: boolean;
  hours: string;
  count: number;
  units: {
    earned: Number,
    consumed: Number
  };
  employee: any;
  timeLogs: TimeLogs[];
  passes: { out: TimeLogs, in: TimeLogs }[];
  shift: Shift;
}

export class ExtendShift {
  checkOutExtend: string;
}
