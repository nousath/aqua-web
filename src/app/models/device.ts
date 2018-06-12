import { Category, Machine } from './category';
import { Mute } from './mute';

export class Device {
  id: string | number = null;
  category: Category = new Category();
  machine: Machine = new Machine();
  name = '';
  type = '';
  mute: Mute[] = [{start: '12:00', end: '1:00'}];
  ip = '';
  port = '';
  bssid = '';
  interval = ''
}
