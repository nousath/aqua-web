import { Employee } from './employee';
import { Shift } from './shift';
import { ShiftType } from '.';

export class EffectiveShift {
    employee: Employee;
    previousShift: Shift;
    shifts: Shift[];
}
