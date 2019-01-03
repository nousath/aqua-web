import { Component, OnInit } from '@angular/core';
import { AmsShiftService } from '../../../services/ams/ams-shift.service';
import { ToastyService } from 'ng2-toasty';
import { ActivatedRoute, Router } from '@angular/router';
import { MdDialog } from '@angular/material';
import { Page } from '../../../common/contracts/page';
import { Shift } from '../../../models/shift';
import { ShiftType } from '../../../models/shift-type';
import { Model } from '../../../common/contracts/model';
import * as _ from 'lodash';
import { Department } from '../../../models';
import { EmsDepartmentService } from '../../../services';
@Component({
  selector: 'aqua-shifts',
  templateUrl: './shifts.component.html',
  styleUrls: ['./shifts.component.css']
})
export class ShiftsComponent implements OnInit {

  shifType: Model<ShiftType>;
  shiftTypes: Page<ShiftType>;
  isFilter = false;
  shiftTypesList = [];
  shiftTyp: ShiftType[];
  selectedShiftType = [];
  departments: Department[];
  selectedDepartment: Department;
  start: string;
  end: string;
  filterFields = [
    'id',
    'start',
    'end',
    'department'
  ]
  constructor(private amsShiftService: AmsShiftService,
    private toastyService: ToastyService,
    private activatedRoute: ActivatedRoute,
    private emsDepartmentService: EmsDepartmentService,
    private router: Router,
    public dialog: MdDialog) {

    // this.shifType = new Model({
    //   api: amsShiftService.shifts,
    //   properties: new Shift()
    // });
    emsDepartmentService.departments.search().then(departments => {
      this.departments = departments.items;
    });

    this.shifType = new Model({
      api: amsShiftService.shiftTypes,
      properties: new ShiftType()
    });

    this.shiftTypes = new Page({
      api: amsShiftService.shiftTypes,
      filters: [
        'ofDate',
        'id',
        'start',
        'end',
        'department'
      ]
    });
    this.fetchshiftTypes();
  }
  fetchByDepartment() {
    this.apply()
  }
  fetchshiftTypes() {
    this.shiftTypes.fetch(  data => {
      _.each(this.shiftTypes.items, (item: ShiftType) => {
        item['isEdit'] = false
      })
    }).catch(err => this.toastyService.error({ title: 'Error', msg: err }));
  }

  ngOnInit() {
      this.getShiftTypes();
  }
  private getShiftTypes() {
    this.amsShiftService.shiftTypes.search().then((page) => {
      this.shiftTyp = page.items;
      this.shiftTypesList = [];
      this.shiftTyp.forEach(item => {
        const obj = {
          id: item.id,
          itemName: item.name
        }
        this.shiftTypesList.push(obj)
      })
    });
  }
  onItemSelect(item: any) {
  }
  OnItemDeSelect(item: any) {
  }
  onSelectAll(items: any) {
  }
  onDeSelectAll(items: any) {
  }

  reset() {
    this.selectedShiftType = [];
    this.selectedDepartment = null;
    this.start = null;
    this.end = null;
  }
  applyFilters(params) {
    const filters = this.shiftTypes.filters.properties;
    const values = params.shiftType
    filters['id']['value'] = values && values.length ? values.map(item => item.id) : '';
    filters['start']['value'] = values && values.start ? values.start : '';
    filters['end']['value'] = values && values.end ? values.end : '';
    filters['department']['value'] = values && values.department ? values.department.name : '';
    this.fetchshiftTypes();
  }
  apply() {
    const params: any = {}
    const values: any = {}
    if (this.selectedShiftType && this.selectedShiftType.length) {
      params.shiftType = this.selectedShiftType.map(item => ({ id: item.id, name: item.itemName }))
      params.shiftTypes = params.shiftType
      values.shiftTypeIds = this.selectedShiftType.map(item => item.id)
    }
    // if (this.start) {
    //   params.shiftType = params.shiftType || {}
    //   params.shiftType.start = this.start || {}
    // }

    // if (this.end) {
    //   params.shiftType = params.shiftType || {}
    //   params.shiftType.end = this.end || {}
    // }
    if (this.selectedDepartment) {
      params.shiftType = params.shiftType || {}
      params.shiftType.department = {
        id: this.selectedDepartment.id,
        code: this.selectedDepartment.code,
        name: this.selectedDepartment.name
      }
    }
    this.applyFilters(params)
  }
  remove(item) {
    this.shifType.properties = item;
    this.shifType.remove()
      .then(() => {
        this.toastyService.info({ title: 'Info', msg: 'shift successfully delete' })
      })
      .catch(err => this.toastyService.error({ title: 'Error', msg: err }));
  }
}
