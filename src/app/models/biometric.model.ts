import { Device } from './device';
import { Employee } from './employee';

export class Biometric {
  id: string;
  code: string;
  canEnable: boolean;
  user: Employee;
  device: Device;
  status: string;
}
