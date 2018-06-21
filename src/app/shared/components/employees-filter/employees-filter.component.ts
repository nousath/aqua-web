import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ValidatorService, AmsShiftService } from '../../../services';
import { ShiftType } from '../../../models/shift-type';
import { Page } from '../../../common/contracts/page';
import { TagType } from '../../../models/tag';
import { AmsTagService } from '../../../services/ams/ams-tag.service';
import { Department } from '../../../models/department';
import { EmsDepartmentService } from '../../../services/ems/ems-department.service';

export interface SelectedTag {
  tagId: string;
  tagTypeId: string;
}

export class Tags {
  selected: SelectedTag[] = [];
  select(tag: SelectedTag) {
    const t: SelectedTag = this.selected.find((i: SelectedTag) => {
      return i.tagTypeId === tag.tagTypeId;
    });
    if (t && tag.tagId === 'select an option')
      return this.selected.splice(this.selected.indexOf(t), 1);
    if (!t)
      this.selected.push(tag);
  }
  reset() {
    this.selected = [];
  }
}

@Component({
  selector: 'aqua-employees-filter',
  templateUrl: './employees-filter.component.html',
  styleUrls: ['./employees-filter.component.css']
})
export class EmployeesFilterComponent implements OnInit {

  @Input()
  selectedEmployeeName: string;

  @Input()
  selectedEmployeeCode: string;

  @Input()
  selectedShiftType: ShiftType;

  @Input()
  selectedAttendanceStatus: string;

  @Input()
  hidden: any;

  @Output()
  onChange: EventEmitter<any> = new EventEmitter();

  @Output()
  onReset: EventEmitter<any> = new EventEmitter();

  shiftTypes: Page<ShiftType>;

  tagTypes: Page<TagType>;

  tags: Tags = new Tags();

  constructor(
    public validatorService: ValidatorService,
    amsShiftService: AmsShiftService,
    tagService: AmsTagService,
  ) {

    this.shiftTypes = new Page({
      api: amsShiftService.shiftTypes
    });

    this.tagTypes = new Page({
      api: tagService.tagTypes
    });
  }

  ngOnInit() {
    this.shiftTypes.fetch().then();
    this.tagTypes.fetch().then();

    this.hidden = this.hidden || {};
  }

  reset() {

    this.tags.reset();
    const tagElements: any[] = document.getElementsByName('tags') as any;
    if (tagElements) {
      tagElements.forEach(item => item.value = '');
    }

    this.selectedShiftType = null;
    this.selectedAttendanceStatus = null;
    this.selectedEmployeeName = null;
    this.selectedEmployeeCode = null;

    this.onReset.emit();
  }

  apply() {
    const tagIds: string[] = [];
    this.tags.selected.forEach((tag: SelectedTag) => {
      tagIds.push(tag.tagId)
    })

    const values = {
      tagIds: tagIds,
      shiftType: this.selectedShiftType,
      attendanceStatus: this.selectedAttendanceStatus,
      employeeName: this.selectedEmployeeName,
      employeeCode: this.selectedEmployeeCode
    }

    console.log(values)

    this.onChange.emit(values);
  }


}
