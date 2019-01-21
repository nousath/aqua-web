import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { PagerModel } from '../../../common/ng-structures';
import { Designation } from '../../../models';
import { DetailModel } from '../../../common/ng-structures';
import { ValidatorService, AutoCompleteService } from '../../../services';
import { EmsDesignationService } from '../../../services/ems/ems-designation.service';
import { ToastyService } from 'ng2-toasty';
import * as _ from 'lodash';
import { ConfirmDialogComponent } from '../../../dialogs/confirm-dialog/confirm-dialog.component';
import { MdDialog, MdDialogRef } from '@angular/material';
import { LocalStorageService } from '../../../services/local-storage.service';
import { FileUploader } from 'ng2-file-upload';
import { FileUploaderDialogComponent } from '../../../shared/components/file-uploader-dialog/file-uploader-dialog.component';
import { PageOptions } from '../../../common/ng-api';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'aqua-designations',
  templateUrl: './designations.component.html',
  styleUrls: ['./designations.component.css']
})
export class DesignationsComponent implements OnInit {

  designations: PagerModel<Designation>
  designation: DetailModel<Designation>
  designationA: Designation[];
  designationsId: number;
  selectedDesignation: Designation;
  designationList = [];
  isNew = false;
  uploader: FileUploader;
  isUpload = false;
  isFilter = false;
  statusFilter = 'active';
  filterFields = [
    'name',
    'status',
    'code'
  ]

  @Output()
  onChange: EventEmitter<any> = new EventEmitter();
  dropdownSettings = {};
  constructor(private emsDesignationService: EmsDesignationService,
    private autoCompleteService: AutoCompleteService,
    public validatorService: ValidatorService,
    private store: LocalStorageService,
    private toastyService: ToastyService,
    public dialog: MdDialog) {

    this.designations = new PagerModel({
      api: emsDesignationService.designations,
      filters: [
        'ofDate',
        'name',
        'code',
        'status'
      ]
    });

    this.designation = new DetailModel({
      api: emsDesignationService.designations,
      properties: new Designation()
    });

    this.fetchDesignation();
  }
  onSelectDesignation(cont: Designation) {
    this.selectedDesignation = cont
  }
  designationSource(keyword: string): Observable<Designation[]> {
    return this.autoCompleteService.searchByKey<Designation>('name', keyword, 'ems', 'designations');
  }
  designationFormatter(data: Designation): string {
    return data.name;
  }
  designationListFormatter(data: Designation): string {
    return `${data.name} (${data.code})`;
  }
  fetchDesignation() {
    this.designations.fetch().then(
      data => {
        _.each(this.designations.items, (item: Designation) => {
          item['isEdit'] = false
        })
      }
    ).catch(err => this.toastyService.error({ title: 'Error', msg: err }));
  }
  fetchByStatus() {
    this.apply()
  }
  private getDesignations() {
    const designationFilter = new PageOptions();
    this.emsDesignationService.designations.search(designationFilter).then(page => {
      this.designationA = page.items;
      this.designationList = [];
      this.designationA.forEach(item => {
        const obj = {
          id: item.id,
          itemName: item.name,
          itemCode: item.code
        };
        this.designationList.push(obj);
      })
    });
  }

  reset() {
    this.selectedDesignation = null;
  }

  toggleDesignation(isOpen?: boolean) {
    this.isNew = isOpen ? true : false;
    this.designation.properties = new Designation();
  }

  edit(designation: Designation, isEdit: boolean) {
    if (isEdit) {
      designation.isEdit = true;
      this.store.setObject(`designationEdit_${designation.id}`, designation);
    } else {
      designation.isEdit = false;
      const d: Designation = this.store.getObject(`designationEdit_${designation.id}`) as Designation;
      designation.code = d.code;
      designation.name = d.name;
      this.store.removeItem(`designationEdit_${designation.id}`);
    }
  }

  remove(id: string) {
    this.designation.properties.id = id;
    this.designation.remove().then(data => {
      this.fetchDesignation()
    }).catch(err => this.toastyService.error({ title: 'Error', msg: err }));
  }

  removeConfirm(designation: Designation) {
    const dialog = this.dialog.open(ConfirmDialogComponent, { width: '40%' });
    dialog.componentInstance.msg = `Are you sure to want to remove designation ${designation.name} ?`;
    dialog.afterClosed().subscribe((value: boolean) => {
      if (value) {
        this.remove(designation.id)
      }
    })

  }

  nameChange() {
    this.designation.properties.code = this.designation.properties.code;
    console.log(this.designation.properties.name)
    console.log(this.designation.properties.code)
  }

  save(designation?: Designation) {
    if (designation) {
      this.designation.properties = designation;
    }
    if (!this.designation.properties.name)
      return this.toastyService.info({ title: 'Info', msg: 'Enter  Name' });
    this.designation.save().then(data => {
      if (designation) {
        designation.isEdit = false;
        this.store.removeItem(`leeaveBalance_${designation.id}`);
      } else {
        this.toggleDesignation();
      }
      this.fetchDesignation()
    }).catch(err => this.toastyService.error({ title: 'Error', msg: err }));
  }

  import() {
    const dialogRef: MdDialogRef<FileUploaderDialogComponent> = this.dialog.open(FileUploaderDialogComponent);
    const component = dialogRef.componentInstance;
    component.uploader = this.emsDesignationService.designations
    component.samples = [{
      name: 'CSV/Excel',
      mapper: 'default',
      url_csv: 'assets/formats/designation.csv',
      url_xlsx: 'assets/formats/designation.xlsx'
    }];
  }


  ngOnInit() {
    this.getDesignations();
  }

  applyFilters(params) {
    const filters = this.designations.filters.properties;
    const values = params.designation
    filters['status'].value = this.statusFilter ? this.statusFilter : 'active';
    filters['name']['value'] = values && values.name ? values.name : '';
    this.fetchDesignation();
  }

  apply() {

    const params: any = {}
    if (this.selectedDesignation) {
      params.designation = {
        id: this.selectedDesignation.id,
        code: this.selectedDesignation.code,
        name: this.selectedDesignation.name
      }
    }
    this.applyFilters(params)
  }
}
