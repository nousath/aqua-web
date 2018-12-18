import { Injectable } from '@angular/core';
import { IApi } from '../../common/contracts/api/api.interface';
import { GenericApi } from '../../common/generic-api';
import { Http } from '@angular/http';
import { Contractor } from '../../models/contractor';

@Injectable()
export class EmsContractorService {

  contractors: IApi<Contractor>;

  constructor(private http: Http) {
    const baseApi = 'ems';

    this.contractors = new GenericApi<Contractor>('contractors', http, baseApi);
  }

}
