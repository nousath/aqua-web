import { Doc } from './doc.model';


export class Folder {
  id: string;
  name: string;
  type: string;
  url: string;
  thumbnail: string;
  folders: Folder[];
  files: Doc[];

  constructor(obj?: any) {

    if (!obj) {
      return;
    }

    this.id = obj.id;
    this.name = obj.name;
    this.type = obj.type;
    this.url = obj.url;
  }
}
