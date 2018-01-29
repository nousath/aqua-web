import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { IApi } from '../../common/contracts/api/api.interface';
import { GenericApi } from '../../common/generic-api';
import { EffectiveShift } from '../../models/effective-shift';

@Injectable()
export class AmsEffectiveShiftService {

  effectiveShifts: IApi<EffectiveShift>;
  downloadRosterExcel: IApi<EffectiveShift>;

  constructor(private http: Http) { 
    const baseApi = 'ams';

    this.effectiveShifts = new GenericApi<EffectiveShift>('effectiveShifts', http, baseApi);
    this.downloadRosterExcel = new GenericApi<any>('effectiveShifts/roster/excelFormat',http, baseApi);
  }

}
