import { ChannelType } from './channel-type';
import { Role } from './ems/role';

export class Organization {
  id = '';
  name = '';
  code = '';
  logo: string;
  status: string;
  timeStamp: Date;

  externalUrl = '';
  activationKey = '';
  onBoardingStatus: 'start' | 'employees' | 'devices' | 'syncapp' | 'alerts' | 'complete' = 'start';
  communicationApps: CommunicationApps = new CommunicationApps();

  constructor(obj?: any) {

    if (!obj) {
      return;
    }

    this.id = obj.id;
    this.code = obj.code;
    this.logo = obj.logo;
    this.name = obj.name;
    this.status = obj.status;
    this.timeStamp = obj.timeStamp;
    // this.services = [];

    // if (obj.services) {
    //   obj.services.forEach(item => {
    //     this.services.push(new Service(item));
    //   });
    // }
  }
}
export class CommunicationApps {
  sms: CommAppConfig = new CommAppConfig();
  email: CommAppConfig = new CommAppConfig();
  chat: CommAppConfig = new CommAppConfig();
}

export class CommAppConfig {
  id = '';
  isDummy = false;
  type: ChannelType = new ChannelType();
}
