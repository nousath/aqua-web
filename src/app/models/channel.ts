import { Organization } from './organization';
import { ChannelType } from './channel-type';

export class Channel {
    id: string;
    type: ChannelType = new ChannelType();
    organization: Organization = new Organization();
    status: string = '';
    config: object= {}
}
