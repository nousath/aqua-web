import { Organization } from './organization';
import { Channel } from './channel';

export class ChannelType {
  id: string;
  name: string;
  category: string;
  description: string = '';
  parameters: ChannelTypeParams[] = [];
  channel: Channel_temp = new Channel_temp();
  picUrl: string = '';
}

export class Channel_temp {
  id: string;
  // organization: Organization = new Organization();
  status: string = '';
  config: object= {}
}

export class ChannelTypeParams {
  id: string = '';
  name: string;
  title: string;
  type: string;
  description: string;
  value: string = null;
  expectedValues: string;
}
