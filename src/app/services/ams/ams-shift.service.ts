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
    if (shiftType && shiftType.id) {
      return shiftType.color || '#000000'
    }

    return '#000000'
  }

}
