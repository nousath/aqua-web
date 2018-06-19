import { ShiftType } from './shift-type';
export class MonthAttendance {
  id = '';
  name = '';
  code = '';
  designation = '';
  picData = '';
  picUrl = '';
  absentDays: number = null;
  presentDays: number = null;
  totalLeaveBalance: number = null;
  shiftType: ShiftType = new ShiftType();
}
