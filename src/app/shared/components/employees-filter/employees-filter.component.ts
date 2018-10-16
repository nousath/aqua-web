import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ValidatorService, AmsShiftService } from '../../../services';
import { ShiftType } from '../../../models/shift-type';
import { Page } from '../../../common/contracts/page';
import { TagType } from '../../../models/tag';
import { AmsTagService } from '../../../services/ams/ams-tag.service';
import { Designation } from '../../../models';
import { EmsDesignationService } from '../../../services/ems/ems-designation.service';
import { Department } from '../../../models/department';
import { EmsDepartmentService } from '../../../services/ems/ems-department.service';
import { ServerPageInput } from '../../../common/contracts/api/page-input';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { Item } from 'angular2-multiselect-dropdown/menu-item';
import * as moment from 'moment';

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
        } else {
          this.selected.push(tag);
        }
      })
    } else {
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
export class EmployeesFilterComponent implements OnInit, OnChanges {


  departments: Department[];
  departmentId: number;
  designations: Designation[];
  designationsId: number;

  shiftTypes: ShiftType[];
  tagTypes: TagType[];


  @Input()
  selectedEmployeeName: string;

  @Input()
  selectedEmployeeCode: string;

  @Input()
  selectedShiftType: ShiftType;

  @Input()
  selectedAttendanceStatus: string;

  @Input()
  fields: string[] = [];

  @Input()
  fromDate: Date;

  @Input()
  hidden: any;

  @Output()
  onChange: EventEmitter<any> = new EventEmitter();

  @Output()
  onReset: EventEmitter<any> = new EventEmitter();

  showCheckOutStatus = false;

  show: {
    date?: boolean,
    month?: boolean,
    name?: boolean,
    code?: boolean,
    userTypes?: boolean,
    designations?: boolean,
    departments?: boolean,
    contractors?: boolean,
    shiftTypes?: boolean,
    attendanceStates?: boolean,
    shiftCount?: boolean,
    checkInStates?: boolean,
    checkOutStates?: boolean
  }


  tags: Tags = new Tags();

  departmentList = [];
  designationList = [];
  statusList = [];
  checkInStatusList = [];
  checkOutStatusList = [];
  hoursList = [];
  selectedCheckInStatus = [];
  selectedCheckOutStatus = [];
  selectedHours = [];
  actionList = [];
  userTypeList = [];
  contractorList = [];
  shiftTypesList = [];

  usertypes = [];
  contractors = [];

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
    private emsDepartmentService: EmsDepartmentService,
    private emsDesignationService: EmsDesignationService,
    public validatorService: ValidatorService,
    private amsShiftService: AmsShiftService,
    private tagService: AmsTagService,
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.fromDate) {
      this.showCheckOutStatus = moment(this.fromDate).isBefore(new Date(), 'd');
    }
    this.show = {
    }

    this.fields.forEach(field => {
      this.show[field] = true;
    });

  }

  ngOnInit() {

    this.hidden = this.hidden || {};
    this.statusList = [{
      id: 1, itemName: 'Present'
    }, {
      id: 2, itemName: 'Absent'
    }, {
      id: 3, itemName: 'HalfDay'
    }, {
      id: 4, itemName: 'OnLeave'
    }]


    this.checkInStatusList = [{
      id: 1, itemName: 'Came Early'
    }, {
      id: 2, itemName: 'Came Late'
    }, {
      id: 3, itemName: 'Missed'
    }]

    this.checkOutStatusList = [{
      id: 1, itemName: 'Left Early'
    }, {
      id: 2, itemName: 'Went Late'
    }, {
      id: 3, itemName: 'Missed'
    }]

    this.hoursList = [{
      id: 1, itemName: 'Short'
    }, {
      id: 2, itemName: 'Extra'
    }]


    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      text: 'Select an option',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      classes: 'myclass',
      displayAllSelectedText: true,
      maxHeight: 200,
      badgeShowLimit: 1
    };

    if (this.fromDate) {
      this.showCheckOutStatus = moment(this.fromDate).isBefore(new Date(), 'd');
    }

    this.getTags();
    this.getDepartments();
    this.getDesignations();
    this.getShiftTypes();
  }

  private getShiftTypes() {
    this.amsShiftService.shiftTypes.search().then((page) => {
      this.shiftTypes = page.items;
      this.shiftTypesList = [];
      this.shiftTypes.forEach(item => {
        const obj = {
          id: item.id,
          itemName: item.name
        }
        this.shiftTypesList.push(obj)
      })
    });
  }

  private getDesignations() {
    const designationFilter = new ServerPageInput();
    this.emsDesignationService.designations.search(designationFilter).then(page => {
      this.designations = page.items;
      this.designationList = [];
      this.designations.forEach(item => {
        const obj = {
          id: item.id,
          itemName: item.name,
        };
        this.designationList.push(obj);
      })
    });
  }

  private getDepartments() {
    const deptFilter = new ServerPageInput();
    deptFilter.query = {
      divisionId: 1
    }
    this.emsDepartmentService.departments.search(deptFilter).then(page => {
      this.departments = page.items;
      this.departmentList = [];
      this.departments.forEach(item => {
        const obj = {
          id: item.id,
          itemName: item.name,
        };
        this.departmentList.push(obj);
      })

    });
  }

  private getTags() {
    this.tagService.tagTypes.search().then(page => {
      this.tagTypes = page.items;
      this.tagTypes.forEach(item => {
        switch (item.name.toLowerCase()) {
          case 'usertype':
            this.usertypes = item.tags;
            break;
          case 'contractor':
            this.contractors = item.tags;
            break;
        }
      });


      this.contractors.forEach(item => {
        const obj = {
          id: item.id,
          itemName: item.name,
        };
        this.contractorList.push(obj);
      })

      this.usertypes.forEach(item => {
        const obj = {
          id: item.id,
          itemName: item.name,
        };
        this.userTypeList.push(obj);
      })
    })
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
    this.selectedCheckInStatus = [];
    this.selectedCheckOutStatus = [];
    this.selectedHours = [];
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
    const designation: string[] = [];

    this.selectedDesignation.forEach(item => {
      designation.push(item.itemName);
    })
    const department: string[] = [];

    this.selectedDepartment.forEach(item => {
      department.push(item.itemName);
    })
    const checkInStatus: string[] = [];
    this.selectedCheckInStatus.forEach(item => {
      if ((item.id).toString() === '1') {
        checkInStatus.push('early')
      } else if ((item.id).toString() === '2') {
        checkInStatus.push('late')
      } else if ((item.id).toString() === '3') {
        checkInStatus.push('missed')
      }
    })

    const checkOutStatus: string[] = [];

    this.selectedCheckOutStatus.forEach(item => {
      if ((item.id).toString() === '1') {
        checkOutStatus.push('early');
      } else if ((item.id).toString() === '2') {
        checkOutStatus.push('late');
      } else if ((item.id).toString() === '3') {
        checkOutStatus.push('missed');
      }
    })

    const hours: string[] = [];
    this.selectedHours.forEach(item => {
      hours.push(item.itemName);
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
      departments: department,
      designations: designation,
      attendanceStatus: status,
      attendanceCheckInStatus: checkInStatus,
      attendanceCheckOutStatus: checkOutStatus,
      attendanceHours: hours,
      needsAction: action,
      employeeName: this.selectedEmployeeName,
      employeeCode: this.selectedEmployeeCode
    }


    this.onChange.emit(values);
  }


}
