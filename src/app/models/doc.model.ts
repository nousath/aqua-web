export class Doc {
  id: string;
  name: string;
  type: string;
  url: string;
  thumbnail: string;
  data: string;

  constructor(obj?: any) {

    if (!obj) {
      return;
    }

    this.id = obj.id;
    this.name = obj.name;
    this.type = obj.type;
    this.url = obj.url;
    this.data = obj.thumbnail;
    this.thumbnail = obj.thumbnail;
  }
}
