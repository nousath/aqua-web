import { Processor } from './processor.model';

export class AlertConfig {
  trigger: Object = {}
  processor: Processor = new Processor();
}
