import { Organization } from './organization';
export class ShiftType {
  id = '';
  name = '';
  code = '';
  startTime = '';
  endTime = '';
  grace: Grace = new Grace();
  department = '';
  breakTime = 30;
  isDynamic = false;
  color: string;

  monday: 'off' | 'full' | 'half' | 'alternate' | null = 'full';
  tuesday: 'off' | 'full' | 'half' | 'alternate' | null = 'full';
  wednesday: 'off' | 'full' | 'half' | 'alternate' | null = 'full';
  thursday: 'off' | 'full' | 'half' | 'alternate' | null = 'full';
  friday: 'off' | 'full' | 'half' | 'alternate' | null = 'full';
  saturday: 'off' | 'full' | 'half' | 'alternate' | null = 'off';
  sunday: 'off' | 'full' | 'half' | 'alternate' | null = 'off';
  changeType: 'now' | 'later' = 'now';
  status = '';

}


class Grace {
  checkIn: CheckIn = new CheckIn();
  checkOut: CheckOut = new CheckOut();
}
class CheckIn {
  early = 30;
  late = 30;
}

class CheckOut {
  early = 0;
  late = 30;
}
