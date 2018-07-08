import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { IApi } from '../../common/contracts/api/api.interface';
import { Shift } from '../../models/shift';
import { ShiftType } from '../../models/shift-type';
import { GenericApi } from '../../common/generic-api';

@Injectable()
export class AmsShiftService {

  shifts: IApi<Shift>;
  shiftTypes: IApi<ShiftType>;

  constructor(private http: Http) {

    const baseApi = 'ams';

    this.shifts = new GenericApi<Shift>('shifts', http, baseApi);
    this.shiftTypes = new GenericApi<ShiftType>('shiftTypes', http, baseApi);

  }

  shiftColour = function (shiftType: ShiftType) {
    let str = 'random';

    if (shiftType && shiftType.id) {
      str = shiftType.id;
    }

    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      // tslint:disable-next-line:no-bitwise
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let colour = '#';
    for (let i = 0; i < 3; i++) {
      // tslint:disable-next-line:no-bitwise
      const value = (hash >> (i * 8)) & 0xFF;
      colour += ('00' + value.toString(16)).substr(-2);
    }
    return colour;
  }

}
