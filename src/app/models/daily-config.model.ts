import { Processor } from './processor.model';
export class DailyConfig {
  // trigger: Object = {}
  channel = '';
  processor: Processor = new Processor();
}
