import { Shift } from './shift';
import { TimeLogs } from '.';

export class DayEvent {
  id = '';
  checkIn: string = null;
  checkOut: string = null;
  hoursWorked: number = null;
  ofDate: string = null;
  status: string;
  shift: Shift = new Shift();
  timeLogs: TimeLogs[];
  employee: { id: string } = { id: '' };
}
