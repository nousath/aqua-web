import { AlertConfig } from './alert-type';
import {AmsAlert} from './alert';
import { DailyInsightAlerts } from './daily-insightAlert';
export class DailyInsight
{
   
    employee: string='';
    alert: AmsAlert = new AmsAlert();
    config: AlertConfig = new AlertConfig();
    date: string='';
    onHome: false; 
   
  }
    export class  Insightparameter
     {
      statistics: {
        count: number
      }
        param: string='';
        count: string='';
        observe: 'response'
      
    }
  
