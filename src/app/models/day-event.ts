import { Shift } from './shift';

export class DayEvent {
  checkIn: string = null;
  checkOut: string = null;
  hoursWorked: number = null;
  ofDate: string = null;
  id = '';
  status = '';
  shift: Shift = new Shift();
  employee: { id: string } = { id: '' };
}
