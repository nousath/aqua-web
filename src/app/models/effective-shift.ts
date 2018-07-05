import { Employee } from './employee';
import { Shift } from './shift';
import { ShiftType, Attendance, Leave } from '.';

export class EffectiveShift {
    employee: Employee;
    previousShift: Shift;
    attendances: Attendance
    leaves: Leave
    shifts: Shift[];
}
