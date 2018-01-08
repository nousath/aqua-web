import { Holiday } from './holiday';
import { ShiftType } from './shift-type';
export class Shift {
  date: Date = null;
  id: string = '';
  status: string = '';
  shiftType: ShiftType;
  holiday: Holiday = new Holiday();
}
