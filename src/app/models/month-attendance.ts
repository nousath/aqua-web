import { ShiftType } from './shift-type';
export class MonthAttendance {
  id: string = '';
  name: string = '';
  code: string = '';
  designation: string = '';
  picData: string = '';
  picUrl: string = '';
  absentDays: number = null;
  presentDays: number = null;
  totalLeaveBalance: number = null;
  shiftType: ShiftType = new ShiftType();
}
