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
    // select(tag: any) {
    // const t: SelectedTag = this.selected.find((i: SelectedTag) => {
    //   return i.tagTypeId === tag.tagTypeId;
    // });
    // if (t && tag.tagId === 'select an option')
    //   return this.selected.splice(this.selected.indexOf(t), 1);
    // if (!t)


    let index = -1
    if (this.selected.length) {
      this.selected.forEach(item => {
        index++
        if (item.tagTypeId === tag.tagTypeId) {
          this.selected.splice(index, 1)
          this.selected.push(tag);
        }
        else {
          this.selected.push(tag);
        }
      })
    }
    else {
      this.selected.push(tag);
    }
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

  selectedValue: boolean
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

    const tagElements: any[] = document.getElementsByName('tags') as any;
    if (tagElements) {
      tagElements.forEach(item => item.value = '');
    }
    this.tags.selected = []
    this.selectedShiftType = null;
    this.selectedAttendanceStatus = null;
    this.selectedEmployeeName = null;
    this.selectedEmployeeCode = null;
    this.selectedValue = undefined;
    this.onReset.emit();
  }

  apply() {
    const tagIds: string[] = [];
    this.tags.selected.forEach((tag: SelectedTag) => {
      if (tagIds.length) {
        const index = tagIds.indexOf(tag.tagId)
        if (index >= 0) {
          tagIds.splice(index, 1)
          tagIds.push(tag.tagId)
        }
        else {
          tagIds.push(tag.tagId)
        }
      }
      else {
        tagIds.push(tag.tagId)
      }
    })

    const values = {
      tagIds: tagIds,
      shiftType: this.selectedShiftType,
      attendanceStatus: this.selectedAttendanceStatus,
      employeeName: this.selectedEmployeeName,
      employeeCode: this.selectedEmployeeCode
    }


    this.onChange.emit(values);
  }


}
