import { ShiftType } from './shift-type';
import { Shift } from './shift';
export class DailyAttendance {
  id = '';
  name = '';
  code = '';
  designation = '';
  picData = '';
  picUrl = '';
  email = '';
  leaveBalances: number = null;
  shiftType: ShiftType = new ShiftType();
  attendance: Attendance = new Attendance();
}

export class Attendance {
  id = '';
  status = '';
  checkIn: Date = null;
  checkOut: Date = null;
  hoursWorked: number = null;
  shift: Shift = new Shift()
}
