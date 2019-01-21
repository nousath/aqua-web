import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { PagerModel } from '../../../common/ng-structures';
import { Division } from '../../../models';
import { DetailModel } from '../../../common/ng-structures';
import { ValidatorService, AutoCompleteService } from '../../../services';
import { EmsDivisionService } from '../../../services/ems/ems-division.service';
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
  selector: 'aqua-divisions',
  templateUrl: './divisions.component.html',
  styleUrls: ['./divisions.component.css']
})
export class DivisionsComponent implements OnInit {

  divisions: PagerModel<Division>
  division: DetailModel<Division>
  divisionA: Division[];
  divisionsId: number;
  selectedDivision: Division;
  divisionList = [];
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
  constructor(private emsDivisionService: EmsDivisionService,
    private autoCompleteService: AutoCompleteService,
    public validatorService: ValidatorService,
    private store: LocalStorageService,
    private toastyService: ToastyService,
    public dialog: MdDialog) {

    this.divisions = new PagerModel({
      api: emsDivisionService.divisions,
      filters: [
        'ofDate',
        'name',
        'code',
        'status'
      ]
    });

    this.division = new DetailModel({
      api: emsDivisionService.divisions,
      properties: new Division()
    });

    this.fetchDivision();
  }
  onSelectDivision(cont: Division) {
    this.selectedDivision = cont
  }
  divisionSource(keyword: string): Observable<Division[]> {
    return this.autoCompleteService.searchByKey<Division>('name', keyword, 'ems', 'divisions');
  }
  divisionFormatter(data: Division): string {
    return data.name;
  }
  divisionListFormatter(data: Division): string {
    return `${data.name} (${data.code})`;
  }
  fetchDivision() {
    this.divisions.fetch().then(
      data => {
        _.each(this.divisions.items, (item: Division) => {
          item['isEdit'] = false
        })
      }
    ).catch(err => this.toastyService.error({ title: 'Error', msg: err }));
  }
  fetchByStatus() {
    this.apply()
  }
  private getDivisions() {
    const divisionFilter = new PageOptions();
    this.emsDivisionService.divisions.search(divisionFilter).then(page => {
      this.divisionA = page.items;
      this.divisionList = [];
      this.divisionA.forEach(item => {
        const obj = {
          id: item.id,
          itemName: item.name,
          itemCode: item.code
        };
        this.divisionList.push(obj);
      })
    });
  }

  reset() {
    this.selectedDivision = null;
  }

  toggleDivision(isOpen?: boolean) {
    this.isNew = isOpen ? true : false;
    this.division.properties = new Division();
  }

  edit(division: Division, isEdit: boolean) {
    if (isEdit) {
      division.isEdit = true;
      this.store.setObject(`divisionEdit_${division.id}`, division);
    } else {
      division.isEdit = false;
      const d: Division = this.store.getObject(`divisionEdit_${division.id}`) as Division;
      division.code = d.code;
      division.name = d.name;
      this.store.removeItem(`divisionEdit_${division.id}`);
    }
  }

  remove(id: string) {
    this.division.properties.id = id;
    this.division.remove().then(data => {
      this.fetchDivision()
    }).catch(err => this.toastyService.error({ title: 'Error', msg: err }));
  }

  removeConfirm(division: Division) {
    const dialog = this.dialog.open(ConfirmDialogComponent, { width: '40%' });
    dialog.componentInstance.msg = `Are you sure to want to remove division ${division.name} ?`;
    dialog.afterClosed().subscribe((value: boolean) => {
      if (value) {
        this.remove(division.id)
      }
    })

  }

  nameChange() {
    this.division.properties.code = this.division.properties.code;
    console.log(this.division.properties.name)
    console.log(this.division.properties.code)
  }

  save(division?: Division) {
    if (division) {
      this.division.properties = division;
    }
    if (!this.division.properties.name)
      return this.toastyService.info({ title: 'Info', msg: 'Enter  Name' });
    this.division.save().then(data => {
      if (division) {
        division.isEdit = false;
        this.store.removeItem(`leeaveBalance_${division.id}`);
      } else {
        this.toggleDivision();
      }
      this.fetchDivision()
    }).catch(err => this.toastyService.error({ title: 'Error', msg: err }));
  }

  import() {
    const dialogRef: MdDialogRef<FileUploaderDialogComponent> = this.dialog.open(FileUploaderDialogComponent);
    const component = dialogRef.componentInstance;
    component.uploader = this.emsDivisionService.divisions
    component.samples = [{
      name: 'CSV/Excel',
      mapper: 'default',
      url_csv: 'assets/formats/division.csv',
      url_xlsx: 'assets/formats/division.xlsx'
    }];
  }


  ngOnInit() {
    this.getDivisions();
  }

  applyFilters(params) {
    const filters = this.divisions.filters.properties;
    const values = params.division
    filters['status'].value = this.statusFilter ? this.statusFilter : 'active';
    filters['name']['value'] = values && values.name ? values.name : '';
    this.fetchDivision();
  }

  apply() {

    const params: any = {}
    if (this.selectedDivision) {
      params.division = {
        id: this.selectedDivision.id,
        code: this.selectedDivision.code,
        name: this.selectedDivision.name
      }
    }
    this.applyFilters(params)
  }
}
