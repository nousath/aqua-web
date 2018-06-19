import { Pipe, PipeTransform } from '@angular/core';
import { ShiftType } from '../../models';

@Pipe({
  name: 'shiftTypeFilter'
})
export class ShiftTypeFilterPipe implements PipeTransform {

  transform(values: ShiftType[], args?: string): any {

    if (!args) {
      return values;
    }

    return values.filter(item => item.name.toLowerCase().startsWith(args.toLowerCase()))
  }
}
