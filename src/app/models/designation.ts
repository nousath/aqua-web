export class Designation {
  name = '';
  code = '';
  id: number = null;
  isEdit = false;

  constructor(obj?: any) {

    if (!obj) {
      return;
    }

    this.id = obj.id;
    this.code = obj.code;
    this.name = obj.name;
  }
}
