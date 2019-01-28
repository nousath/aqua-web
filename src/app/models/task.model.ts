import { ModelBase } from '../common/contracts/base.model';
import { Device } from '.';
import { Employee } from './employee';
import { Organization } from './organization';

export class Task extends ModelBase {
  device: Device;
  employee: Employee;

  action: string;
  assignedTo: String;
  data: string;
  date: Date;
  status: string;
}



