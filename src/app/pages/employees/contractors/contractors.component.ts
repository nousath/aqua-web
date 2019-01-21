import { Component, OnInit } from '@angular/core';
import { PagerModel } from '../../../common/ng-structures';
import { DetailModel } from '../../../common/ng-structures';
import { ValidatorService, AutoCompleteService } from '../../../services';
import { EmsContractorService } from '../../../services/ems/ems-contractor.service';
import { ToastyService } from 'ng2-toasty';
import * as _ from 'lodash';
import { ConfirmDialogComponent } from '../../../dialogs/confirm-dialog/confirm-dialog.component';
import { MdDialog, MdDialogRef } from '@angular/material';
import { LocalStorageService } from '../../../services/local-storage.service';
import { Contractor } from '../../../models/contractor';
import { FileUploader } from 'ng2-file-upload';
import { FileUploaderDialogComponent } from '../../../shared/components/file-uploader-dialog/file-uploader-dialog.component';
import { PageOptions } from '../../../common/ng-api';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'aqua-contractors',
  templateUrl: './contractors.component.html',
  styleUrls: ['./contractors.component.css']
})
export class ContractorsComponent implements OnInit {
  contractors: PagerModel<Contractor>
  contractor: DetailModel<Contractor>
  contractorA: Contractor[];
  selectedContractor: Contractor;
  contractorId: number;
  isNew = false;
  uploader: FileUploader;
  isUpload = false;
  isFilter = false;
  contractorList = [];
  statusFilter = 'active';
  filterFields = [
    'name',
    'code',
    'status'
  ]
  dropdownSettings = {};
  constructor(private emsContractorService: EmsContractorService,
    public validatorService: ValidatorService,
    private autoCompleteService: AutoCompleteService,
    private store: LocalStorageService,
    private toastyService: ToastyService,
    public dialog: MdDialog) {

    this.contractors = new PagerModel({
      api: emsContractorService.contractors,
      filters: [
        //   {
        //   field: 'divisionId',
        //   value: 1,
        // },
        'ofDate',
        'name',
        'code',
        'status']
    });

    this.contractor = new DetailModel({
      api: emsContractorService.contractors,
      properties: new Contractor()
    });

    this.fetchContractor();
  }
  onSelectCont(cont: Contractor) {
    this.selectedContractor = cont
  }
  contSource(keyword: string): Observable<Contractor[]> {
    return this.autoCompleteService.searchByKey<Contractor>('name', keyword, 'ems', 'contractors');
  }
  contFormatter(data: Contractor): string {
    return data.name;
  }
  contListFormatter(data: Contractor): string {
    return `${data.name} (${data.code})`;
  }
  fetchContractor() {
    this.contractors.fetch().then(
      data => {
        _.each(this.contractors.items, (item: Contractor) => {
          item['isEdit'] = false
        })
      }
    ).catch(err => this.toastyService.error({ title: 'Error', msg: err }));
  }
  fetchByStatus() {
    this.apply()
  }
  applyFilters(params) {
    const filters = this.contractors.filters.properties;
    const values = params.contractor
    filters['status'].value = this.statusFilter ? this.statusFilter : 'active';
    filters['name']['value'] = values && values.name ? values.name : '';
    this.fetchContractor();
  }
  apply() {
    const params: any = {}
    if (this.selectedContractor) {
      params.contractor = {
        id: this.selectedContractor.id,
        code: this.selectedContractor.code,
        name: this.selectedContractor.name
      }
    }
    this.applyFilters(params)
  }
  private getContractors() {
    const contractorFilter = new PageOptions();
    // deptFilter.query = {
    //   divisionId: 1
    // }
    this.emsContractorService.contractors.search(contractorFilter).then(page => {
      this.contractorA = page.items;
      this.contractorList = [];
      this.contractorA.forEach(item => {
        const obj = {
          id: item.id,
          itemName: item.name,
          itemCode: item.code,
        };
        this.contractorList.push(obj);
      })
    });
  }


  reset() {
    this.selectedContractor = null;
  }
  toggleContractor(isOpen?: boolean) {
    this.isNew = isOpen ? true : false;
    this.contractor.properties = new Contractor();
  }

  edit(contractor: Contractor, isEdit: boolean) {
    if (isEdit) {
      contractor.isEdit = true;
      this.store.setObject(`contractorEdit_${contractor.divisionId}`, contractor);
    } else {
      contractor.isEdit = false;
      const d: Contractor = this.store.getObject(`contractorEdit_${contractor.divisionId}`) as Contractor;
      contractor.code = d.code;
      contractor.name = d.name;
      this.store.removeItem(`contractorEdit_${contractor.divisionId}`);
    }
  }

  remove(id: number) {
    this.contractor.properties.id = id;
    this.contractor.remove().then(data => {
      this.fetchContractor()
    }).catch(err => this.toastyService.error({ title: 'Error', msg: err }));
  }

  nameChange() {
    this.contractor.properties.code = this.contractor.properties.code;
  }

  removeConfirm(contractor: Contractor) {
    const dialog = this.dialog.open(ConfirmDialogComponent, { width: '40%' });
    dialog.componentInstance.msg = `Are you sure to want to remove contractor ${contractor.name} ?`;
    dialog.afterClosed().subscribe((value: boolean) => {
      if (value) {
        this.remove(contractor.id)
      }
    })
  }
  save(contractor?: Contractor) {
    if (contractor) {
      this.contractor.properties = contractor;
    }
    if (!this.contractor.properties.name)
      return this.toastyService.info({ title: 'Info', msg: 'Enter  Name' });
    this.contractor.save().then(data => {
      if (contractor) {
        contractor.isEdit = false;
        this.store.removeItem(`leaveBalance_${contractor.divisionId}`);
      } else {
        this.toggleContractor();
      }
      this.fetchContractor()
    }).catch(err => this.toastyService.error({ title: 'Error', msg: err }));
  }

  import() {
    const dialogRef: MdDialogRef<FileUploaderDialogComponent> = this.dialog.open(FileUploaderDialogComponent);
    const component = dialogRef.componentInstance;
    component.uploader = this.emsContractorService.contractors
    component.samples = [{
      name: 'CSV/Excel',
      mapper: 'default',
      url_csv: 'assets/formats/contractor.csv',
      url_xlsx: 'assets/formats/contractor.xlsx'
    }];
  }
  ngOnInit() {
    this.getContractors();
  }
}
