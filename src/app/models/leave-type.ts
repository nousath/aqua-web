import { Organization } from './organization';
export class LeaveType {
  id = '';
  code = '';
  name = '';
  unitsPerDay: number = null;
  unlimited = false;
  days: number = null;
  category: 'lossOfPay' | 'OnDuty' | 'paidLeave' | null = null;
  isEdit = false;
  organization: Organization = new Organization();
}
