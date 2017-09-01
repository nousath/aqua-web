import { Category, Machine } from './category';

export class Device {
  id: string | number = null;
  category: Category = new Category();
  machine: Machine = new Machine();
  ip: string = '';
  port: string = '';
  bssid: string = '';
}
