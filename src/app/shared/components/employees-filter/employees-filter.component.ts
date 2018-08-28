import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ValidatorService, AmsShiftService } from '../../../services';
import { ShiftType } from '../../../models/shift-type';
import { Page } from '../../../common/contracts/page';
import { TagType } from '../../../models/tag';
import { AmsTagService } from '../../../services/ams/ams-tag.service';
import { Department } from '../../../models/department';
import { EmsDepartmentService } from '../../../services/ems/ems-department.service';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { Item } from 'angular2-multiselect-dropdown/menu-item';

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

  departmentList = [];
  designationList = [];
  statusList = [];
  actionList = [];
  userTypeList = [];
  contractorList = [];
  shiftTypesList = [];

  designations = [];
  departments = [];
  usertypes = [];
  contractors

  selectedDesignation = [];
  selectedDepartment = [];
  selectedUsertype = [];
  selectedContractor = [];
  selectedStatus = [];
  selectedAction = [];
  selectedShift = [];
  dropdownSettings = {};
  selectedValue: boolean;


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
    this.tagTypes.fetch().then(result => {
      this.getTags(result.items);
    });
    this.shiftTypes.fetch().then();
    this.hidden = this.hidden || {};
    this.statusList = [{
      id: 1, itemName: 'All'
    }, {
      id: 2, itemName: 'Present'
    }, {
      id: 3, itemName: 'Absent'
    }, {
      id: 4, itemName: 'MissedSwipe'
    }, {
      id: 5, itemName: 'HalfDay'
    }, {
      id: 6, itemName: 'OnLeave'
    }, {
      id: 7, itemName: 'LateComing'
    }, {
      id: 8, itemName: 'EarlyGoing'
    }]

    this.actionList = [{
      id: 1, itemName: 'Missed Check Out'
    }, {
      id: 2, itemName: 'Missed Check In'
    }, {
      id: 3, itemName: 'Attendance Short'
    }]
  }

  getTags(tags: any) {
    tags.forEach(item => {
      switch (item.name.toLowerCase()) {
        case 'department':
          this.departments = item.tags;
          break;
        case 'designation':
          this.designations = item.tags;
          break;
        case 'usertype':
          this.usertypes = item.tags;
          break;
        case 'contractor':
          this.contractors = item.tags;
          break;
      }
    });

    this.designations.forEach(item => {
      let obj = {
        id: item.id,
        itemName: item.name,
      };
      this.designationList.push(obj);
    })

    this.departments.forEach(item => {
      let obj = {
        id: item.id,
        itemName: item.name,
      };
      this.departmentList.push(obj);
    })

    this.contractors.forEach(item => {
      let obj = {
        id: item.id,
        itemName: item.name,
      };
      this.contractorList.push(obj);
    })

    this.usertypes.forEach(item => {
      let obj = {
        id: item.id,
        itemName: item.name,
      };
      this.userTypeList.push(obj);
    })
    console.log(this.shiftTypes);
    this.shiftTypes.items.forEach(item => {
      let obj = {
        id: item.id,
        itemName: item.name
      }
      this.shiftTypesList.push(obj)
    })

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      text: 'Select an option',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      classes: "myclass",
      displayAllSelectedText: true,
      maxHeight: 200,
      badgeShowLimit: 1
    };

  }
  onItemSelect(item: any) {
    console.log(item.id);
  }
  OnItemDeSelect(item: any) {
    console.log(item.id);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  onDeSelectAll(items: any) {
    console.log(items);
  }

  reset() {

    const tagElements: any[] = document.getElementsByName('tags') as any;
    if (tagElements) {
      tagElements.forEach(item => item.value = '');
    }
    this.selectedDesignation = [];
    this.selectedDepartment = [];
    this.selectedUsertype = [];
    this.selectedContractor = [];
    this.selectedStatus = [];
    this.selectedShift = [];
    this.tags.selected = [];
    this.selectedAction = [];
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
    this.selectedDesignation.forEach(item => {
      tagIds.push(item.id);
    })
    this.selectedDepartment.forEach(item => {
      tagIds.push(item.id);
    })
    this.selectedUsertype.forEach(item => {
      tagIds.push(item.id);
    })
    this.selectedContractor.forEach(item => {
      tagIds.push(item.id);
    })
    console.log(tagIds)

    const status: string[] = [];
    this.selectedStatus.forEach(item => {
      status.push(item.itemName);
    })

    const action: string[] = [];
    this.selectedAction.forEach(item => {
      action.push(item.itemName);
    })
    console.log(action)

    const shifts: string[] = [];
    this.selectedShift.forEach(item => {
      shifts.push(item.id)
    })
    console.log(shifts)

    const values = {
      tagIds: tagIds,
      shiftType: shifts,
      attendanceStatus: status,
      needsAction: action,
      employeeName: this.selectedEmployeeName,
      employeeCode: this.selectedEmployeeCode
    }


    this.onChange.emit(values);
  }


}
