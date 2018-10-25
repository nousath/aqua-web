import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'name'
})
export class NamePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!value) {
      return ''
    }

    if (value.length) {
      let name = '';
      value.forEach(element => {
        name = `${element.name}|${name}`
      });

      return name.substr(0, name.length - 1)
    }
    return value.name || '';
  }

}
