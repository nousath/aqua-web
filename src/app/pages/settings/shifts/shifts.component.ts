import { Component, OnInit } from '@angular/core';
import { AmsShiftService } from '../../../services/ams/ams-shift.service';
import { PagerModel } from '../../../common/ng-structures';
import { ShiftType } from '../../../models/shift-type';
import { Department } from '../../../models';
import { EmsDepartmentService } from '../../../services';
@Component({
  selector: 'aqua-shifts',
  templateUrl: './shifts.component.html',
  styleUrls: ['./shifts.component.css']
})
export class ShiftsComponent implements OnInit {

  shiftTypes: PagerModel<ShiftType>;
  departmentShifts: ShiftType[] = [];
  sharedShifts: ShiftType[] = [];
  departments: Department[];
  selectedDepartment: Department = null;
  constructor(
    amsShiftService: AmsShiftService,
    emsDepartmentService: EmsDepartmentService
  ) {
    emsDepartmentService.departments.search().then(departments => {
      this.departments = departments.items;
    });

    this.shiftTypes = new PagerModel({
      api: amsShiftService.shiftTypes,
      filters: ['department']
    });
  }
  getData() {
    this.shiftTypes.filters.properties['department']['value'] = 'shared';

    if (this.selectedDepartment && this.selectedDepartment.name) {
      this.shiftTypes.filters.properties['department']['value'] = this.selectedDepartment.name
    }
    this.shiftTypes.fetch().then(page => {
      this.departmentShifts = [];
      this.sharedShifts = [];

      this.sharedShifts = page.items.filter(item => !item.department)
      if (this.selectedDepartment) {
        this.departmentShifts = page.items.filter(item => item.department)
      }
    });
  }

  ngOnInit() {
    this.getData();
  }
}
