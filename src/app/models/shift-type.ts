import { Organization } from './organization';
export class ShiftType {
  id = '';
  name = '';
  code = '';
  startTime = '';
  endTime = '';
  
  monday: 'off' | 'full' | 'half' | 'alternate' | null = null;
  tuesday: 'off' | 'full' | 'half' | 'alternate' | null = null;
  wednesday: 'off' | 'full' | 'half' | 'alternate' | null = null;
  thursday: 'off' | 'full' | 'half' | 'alternate' | null = null;
  friday: 'off' | 'full' | 'half' | 'alternate' | null = null;
  saturday: 'off' | 'full' | 'half' | 'alternate' | null = null;
  sunday: 'off' | 'full' | 'half' | 'alternate' | null = null;
  changeType: 'now' | 'later' = 'now';
  status = '';
  
}


