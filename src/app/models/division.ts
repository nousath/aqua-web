export class Division {
  id: string;

  name = '';
  code = '';
  address: DivAddress = new DivAddress();
  isEdit = false;

  constructor(obj?: any) {

    if (!obj) {
      return;
    }

    this.id = obj.id;
    this.code = obj.code;
    this.name = obj.name;
    this.address = this.address || new DivAddress();
  }
}
export class DivAddress {
  line1 = '';
  line2 = '';
  city = '';
  state = '';
  district = '';
  pinCode = '';
}

