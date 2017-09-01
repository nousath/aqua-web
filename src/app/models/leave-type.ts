import { Organization } from './organization';
export class LeaveType {
  id: string = '';
  code: string = '';
  name: string = '';
  unitsPerDay: number = null;
  unlimited: boolean = false;
  days: number = null;
  category: 'lossOfPay' | 'OnDuty' | 'paidLeave' | null = null;
  isEdit: boolean = false;
  organization: Organization = new Organization();
}
