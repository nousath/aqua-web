import { Organization } from './organization';
import { Channel } from './channel';

export class ChannelType {
  id: string;
  name: string;
  category: string;
  description = '';
  parameters: ChannelTypeParams[] = [];
  channel: ChannelTemp = new ChannelTemp();
  picUrl = '';
}

export class ChannelTemp {
  id: string;
  // organization: Organization = new Organization();
  status = '';
  config: object= {}
}

export class ChannelTypeParams {
  id = '';
  name: string;
  title: string;
  type: string;
  description: string;
  value: string = null;
  expectedValues: string;
}
