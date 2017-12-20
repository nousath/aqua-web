export class Category {
  id: string = '';
  name: string = '';
  machines: Machine[] = [];
}

export class Machine {
  id: string = '';
  manufacturer: string = '';
  model: string = '';
  picData: string = '';
  picUrl: string = '';
  port: '';
}
