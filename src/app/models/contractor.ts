export class Contractor {
  id: number = null;
  name = '';
  code = '';
  isEdit = false;
  divisionId: number;

  constructor(obj?: any) {

    if (!obj) {
      return;
    }

    this.id = obj.id;
    this.code = obj.code;
    this.name = obj.name;
  }
}

