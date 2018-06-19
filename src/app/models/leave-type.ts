import { Organization } from './organization';
import { Periodicity } from './periodicity';


export class LeaveType {
  id = '';
  code = '';
  name = '';
  unitsPerDay: number = null;
  unlimited = false;
  days: number = null;
  category: 'lossOfPay' | 'OnDuty' | 'paidLeave' | null = null;
  periodicity: Periodicity = new Periodicity();
  carryForward: number = null;
  monthlyLimit: number;
  isEdit = false;
  organization: Organization = new Organization();
}
