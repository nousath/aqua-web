import { Component, OnInit } from '@angular/core';
import { Page } from '../../../common/contracts/page';
import { Model } from '../../../common/contracts/model';
import { ValidatorService } from '../../../services';
import { EmsContractorService } from '../../../services/ems/ems-contractor.service';
import { ToastyService } from 'ng2-toasty';
import * as _ from 'lodash';
import { ConfirmDialogComponent } from '../../../dialogs/confirm-dialog/confirm-dialog.component';
import { MdDialog, MdDialogRef } from '@angular/material';
import { LocalStorageService } from '../../../services/local-storage.service';
import { Contractor } from '../../../models/contractor';
import { FileUploader } from 'ng2-file-upload';
import { FileUploaderDialogComponent } from '../../../shared/components/file-uploader-dialog/file-uploader-dialog.component';

@Component({
  selector: 'aqua-contractors',
  templateUrl: './contractors.component.html',
  styleUrls: ['./contractors.component.css']
})
export class ContractorsComponent implements OnInit {
  contractors: Page<Contractor>
  contractor: Model<Contractor>
  isNew = false;
  uploader: FileUploader;
  isUpload = false;
  isFilter = false;
  filterFields = [
    'contractors'
  ]

  constructor(private emsContractorService: EmsContractorService,
    public validatorService: ValidatorService,
    private store: LocalStorageService,
    private toastyService: ToastyService,
    public dialog: MdDialog) {

    this.contractors = new Page({
      api: emsContractorService.contractors,
      filters: [
        //   {
        //   field: 'divisionId',
        //   value: 1,
        // },
        'ofDate',
        'contractors']
    });

    this.contractor = new Model({
      api: emsContractorService.contractors,
      properties: new Contractor()
    });

    this.fetchContractor();
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

  applyFilters(result) {
    const filters = this.contractors.filters.properties;

    const values = result.params;
    filters['contractors']['value'] = values.employee.contractors ? values.employee.contractors.map(item => item.name) : '';
    this.fetchContractor();
  }

  reset() {

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

  remove(id: string) {
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
  }
}
