import { Holiday } from './holiday';
export class Shift {
  date: Date = null;
  id: string = '';
  status: string = '';
  holiday: Holiday = new Holiday();
}
