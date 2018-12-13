export class Designation {
  name = '';
  code = '';
  id = '';
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
