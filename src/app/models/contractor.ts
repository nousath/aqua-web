export class Contractor {
  id: string;

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

