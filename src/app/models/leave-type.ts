import { Organization } from './organization';
import { Periodicity } from './periodicity';


export class LeaveType {
  id: string = '';
  code: string = '';
  name: string = '';
  unitsPerDay: number = null;
  unlimited: boolean = false;
  days: number = null;
  category: 'lossOfPay' | 'OnDuty' | 'paidLeave' | null = null;
  periodicity: Periodicity = new Periodicity();
  carryForward: number = null;
  isEdit: boolean = false;
  organization: Organization = new Organization();
}