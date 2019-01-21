import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { IApi } from '../../common/ng-api/api.interface';
import { GenericApi } from '../../common/ng-api/generic-api';
import { EffectiveShift } from '../../models/effective-shift';
import * as moment from 'moment';
import { Shift } from '../../models';

@Injectable()
export class AmsEffectiveShiftService {

  effectiveShifts: IApi<EffectiveShift>;
  downloadRosterExcel: IApi<EffectiveShift>;
  employeeEffectiveShift: IApi<EffectiveShift>;
  constructor(private http: Http) {
    const baseApi = 'ams';

    this.effectiveShifts = new GenericApi<EffectiveShift>('effectiveShifts', http, baseApi);
    this.downloadRosterExcel = new GenericApi<any>('effectiveShifts/roster/excelFormat', http, baseApi);
    this.employeeEffectiveShift = new GenericApi<any>('effectiveShifts/byDate', http, baseApi);
  }

  getCurrentShift = (item: EffectiveShift): Shift => {
    const current = new Shift();

    current.shiftType = item.previousShift.shiftType
    current.date = moment(item.previousShift.date).toDate()

    item.shifts.forEach(shift => {
      const date = moment(shift.date)
      if (date.isBetween(current.date, new Date())) {
        current.shiftType = shift.shiftType
        current.date = date.toDate()
      }
    });
    return current;
  }

  getUpcomingShifts = (item: EffectiveShift): Shift[] => {
    const shifts: Shift[] = [];
    item.shifts.forEach(shift => {
      const date = moment(shift.date)
      if (date.isAfter(new Date())) {
        shifts.push(shift)
      }
    });

    return shifts
  }

}
