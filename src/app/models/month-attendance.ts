import { ShiftType } from './shift-type';
import { Employee } from './employee';
export class MonthAttendance {
  employee: Employee;
  absentDays: number = null;
  presentDays: number = null;
  leaveDays: number = null;
  offDays: number = null;
  holidayDays: number = null;
}
