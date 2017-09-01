import { Organization } from './organization';
import { Channel } from './channel';

export class ChannelType {
  id: string;
  name: string;
  category: string;
  description: string = '';
  parameters: ChannelTypeParams[] = [];
  channel: Channel = new Channel();
  picUrl: string = '';
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
