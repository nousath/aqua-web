export class Category {
  id = '';
  name = '';
  machines: Machine[] = [];
}

export class Machine {
  id = '';
  manufacturer = '';
  model = '';
  picData = '';
  picUrl = '';
  port: '';
}
