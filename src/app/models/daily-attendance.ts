import { ShiftType } from './shift-type';
export class DailyAttendance {
  id: string = '';
  name: string = '';
  code: string = '';
  designation: string = '';
  picData: string = '';
  picUrl: string = '';
  email: string = '';
  leaveBalances: number = null;
  shiftType: ShiftType = new ShiftType();
  attendance: Attendance = new Attendance();
}

export class Attendance {
  id: string = '';
  status: string = '';
  checkIn: Date = null;
  checkOut: Date = null;
  hoursWorked: number = null;
}
