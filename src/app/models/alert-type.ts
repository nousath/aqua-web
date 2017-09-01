import { AlertParameter } from './alert';
export class AlertType {
  id: string = '';
  name: string = '';
  code: string = '';
  description: string = '';
  picUrl: string = '';
  cost: number = null;
  default: boolean = false;
  // processor: Processor = new Processor();
  trigger: Trigger = new Trigger();
}


export class Processor {
  channel: string = ''
}

export class Trigger {
  parameters: AlertParameter[] = []
}

export class AlertConfig {
  trigger: Object = {}
  processor: Processor = new Processor();
}
