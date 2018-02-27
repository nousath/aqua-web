import { Holiday } from './holiday';
import { Organization } from './organization';
import { AlertType,AlertConfig } from './alert-type';
import { Processor} from './index';
import { DailyParameter } from './insights';
export class DailyInsightAlerts
  {
    id: string="";
    status: string="";
    organization: Organization = new Organization();
    config: DailyConfig = new DailyConfig();
    processor:Processor=new Processor();
    alertType: AlertType = new AlertType();
    
  }
    export class processor{
      channel?: string = '';
       dailyParameter: DailyParameter[];
    }
    export class DailyConfig {
      //trigger: Object = {}
      channel?: string = '';
      processor: Processor = new Processor();
    }
  export class trigger{
    dailyParameter: DailyParameter[]; 
  }
    
