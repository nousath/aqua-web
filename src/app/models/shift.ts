import { Holiday } from './holiday';
import { ShiftType } from './shift-type';
export class Shift {
  date: Date = null;
  id = '';
  status = '';
  shiftType: ShiftType;
  holiday: Holiday = new Holiday();
}
