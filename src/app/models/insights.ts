
import { DailyInsightAlerts } from './daily-insightAlert';
import { Organization } from './organization';
import { AlertType ,AlertConfig} from './alert-type';

export class insights
{
    id: string='';
    status: string='';
    date:string='';
    organization: Organization = new Organization();
    alertType: AlertType = new AlertType();
    config: AlertConfig = new AlertConfig();

    }
      
   
    export class DailyParameter {
        id: string = '';
        name: string = '';
        value: number | string = null;
        title: string = '';
        type: string = '';
        description: string = '';
        expectedValues: string[] = [];
      }