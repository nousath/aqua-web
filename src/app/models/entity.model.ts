export class Entity {
  id: string;
  type: string;
  constructor(obj?: any) {

    if (!obj) {
      return;
    }

    this.id = obj.id;
    this.type = obj.type;
  }
}
