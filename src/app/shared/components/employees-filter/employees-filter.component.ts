import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ValidatorService, AmsShiftService, AutoCompleteService } from '../../../services';
import { ShiftType } from '../../../models/shift-type';
import { TagType } from '../../../models/tag';
import { AmsTagService } from '../../../services/ams/ams-tag.service';
import { Designation, Employee } from '../../../models';
import { EmsDesignationService } from '../../../services/ems/ems-designation.service';
import { Department } from '../../../models/department';
import { EmsDepartmentService } from '../../../services/ems/ems-department.service';
import { ServerPageInput } from '../../../common/contracts/api/page-input';
import * as moment from 'moment';
import { Observable } from 'rxjs/Observable';

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
  fields: string[] = [];

  @Input()
  fromDate: Date;

  @Input()
  tillDate: Date;

  @Input()
  selectedEmployeeName: string;

  @Input()
  selectedEmployeeCode: string;

  selectedAttendanceStatus = [];
  selectedCheckInStatus = [];
  selectedCheckOutStatus = [];
  selectedClockedStatus = [];
  selectedDesignation = [];
  selectedDepartment = [];
  selectedUserType = [];
  selectedContractor = [];
  selectedShiftType = [];
  selectedSupervisor: Employee;
  clockedGreaterThan: number;
  clockedLessThan: number;

  checkInBefore: string;
  checkInAfter: string;
  checkOutBefore: string;
  checkOutAfter: string;

  @Input()
  hidden: any;

  @Output()
  onChange: EventEmitter<any> = new EventEmitter();

  @Output()
  onReset: EventEmitter<any> = new EventEmitter();


  show: {
    date?: boolean,
    tillDate?: boolean,

    month?: boolean,
    name?: boolean,
    code?: boolean,
    userTypes?: boolean,
    designations?: boolean,
    departments?: boolean,
    contractors?: boolean,
    supervisor?: boolean,

    shiftTypes?: boolean,
    attendanceStates?: boolean,

    clocked?: boolean,
    checkIn?: boolean,
    checkOut?: boolean
  }

  departmentList = [];
  designationList = [];
  userTypeList = [];
  contractorList = [];

  shiftTypesList = [];

  attendanceStatusList = [];
  checkInStatusList = [];
  checkOutStatusList = [];
  clockedStatusList = [];

  dropdownSettings = {};

  constructor(
    private emsDepartmentService: EmsDepartmentService,
    private emsDesignationService: EmsDesignationService,
    private autoCompleteService: AutoCompleteService,
    public validatorService: ValidatorService,
    private amsShiftService: AmsShiftService,
    private tagService: AmsTagService,
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {

    this.show = {
    }

    this.fields.forEach(field => {
      this.show[field] = true;
    });

    if (this.fromDate) {
      this.show.checkOut = moment(this.fromDate).isBefore(new Date(), 'd');
    }

  }

  ngOnInit() {

    this.hidden = this.hidden || {};
    this.attendanceStatusList = [
      { id: 1, code: 'present', itemName: 'Present' },
      { id: 2, code: 'absent', itemName: 'Absent' },
      { id: 3, code: 'halfDay', itemName: 'Half Day' },
      { id: 4, code: 'onLeave', itemName: 'On Leave' },
      { id: 5, code: 'weekOff', itemName: 'Week Off' }
    ]


    this.checkInStatusList = [
      { id: 1, code: 'early', itemName: 'Came Early' },
      { id: 2, code: 'late', itemName: 'Came Late' },
      { id: 3, code: 'missed', itemName: 'Missed' }]

    this.checkOutStatusList = [
      { id: 1, code: 'early', itemName: 'Left Early' },
      { id: 2, code: 'late', itemName: 'Went Late' },
      { id: 3, code: 'missed', itemName: 'Missed' }
    ]

    this.clockedStatusList = [
      { id: 1, code: 'short', itemName: 'Short' },
      { id: 2, code: 'extra', itemName: 'Extra' }
    ]


    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      text: '',
      selectAllText: 'All',
      unSelectAllText: 'All',
      enableSearchFilter: true,
      classes: 'myclass',
      displayAllSelectedText: true,
      maxHeight: 200,
      badgeShowLimit: 1
    };

    if (this.fromDate) {
      this.show.checkOut = moment(this.fromDate).isBefore(new Date(), 'd');
    }

    if (this.show.contractors || this.show.userTypes) {
      this.getTags();
    }
    if (this.show.departments) {
      this.getDepartments();
    }
    if (this.show.designations) {
      this.getDesignations();
    }

    if (this.show.shiftTypes) {
      this.getShiftTypes();
    }
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

  onSelectSup(emp: Employee) {
    this.selectedSupervisor = emp
  }

  empSource(keyword: string): Observable<Employee[]> {
    return this.autoCompleteService.searchByKey<Employee>('name', keyword, 'ams', 'employees');
  }

  empFormatter(data: Employee): string {
    return data.name;
  }

  empListFormatter(data: Employee): string {
    return `${data.name} (${data.code})`;
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
      this.userTypeList = [];
      this.contractorList = []
      this.tagTypes.forEach(item => {
        switch (item.name.toLowerCase()) {
          case 'usertype':
            item.tags.forEach(obj => {
              this.userTypeList.push({
                id: obj.id,
                itemName: obj.name,
              });
            });
            break;
          case 'contractor':
            item.tags.forEach(obj => {
              this.contractorList.push({
                id: obj.id,
                itemName: obj.name,
              });
            });
            break;
        }
      });
    })
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
    this.selectedDesignation = [];
    this.selectedDepartment = [];
    this.selectedUserType = [];
    this.selectedContractor = [];
    this.selectedAttendanceStatus = [];
    this.selectedShiftType = [];

    this.selectedCheckInStatus = [];
    this.selectedCheckOutStatus = [];

    this.selectedClockedStatus = [];

    this.selectedAttendanceStatus = null;
    this.clockedGreaterThan = null;
    this.clockedLessThan = null;
    this.checkInBefore = null;
    this.checkInAfter = null;
    this.checkOutBefore = null;
    this.checkOutAfter = null;

    this.selectedEmployeeName = null;
    this.selectedEmployeeCode = null;
    this.selectedSupervisor = null;
    this.onReset.emit();
  }

  apply() {

    const values: any = {}
    if (this.fromDate) {
      values.dates = values.dates || {}
      values.dates.from = this.fromDate
    }

    if (this.tillDate) {
      values.dates = values.dates || {}
      values.dates.till = this.tillDate
    }

    if (this.selectedEmployeeName) {
      values.employee = values.employee || {}
      values.employee.name = this.selectedEmployeeName
    }

    if (this.selectedEmployeeCode) {
      values.employee = values.employee || {}
      values.employee.code = this.selectedEmployeeCode
    }

    if (this.selectedSupervisor) {
      values.employee = values.employee || {}
      values.employee.supervisor = {
        id: this.selectedSupervisor.id,
        code: this.selectedSupervisor.code,
        name: this.selectedSupervisor.name
      }
    }

    if (this.selectedContractor && this.selectedContractor.length) {
      values.employee = values.employee || {}
      values.employee.contractors = this.selectedContractor.map(item => ({ id: item.id, name: item.itemName }))
    }

    if (this.selectedUserType && this.selectedUserType.length) {
      values.employee = values.employee || {}
      values.employee.userTypes = this.selectedUserType.map(item => ({ id: item.id, name: item.itemName }))
    }

    if (this.selectedDepartment && this.selectedDepartment.length) {
      values.employee = values.employee || {}
      values.employee.departments = this.selectedDepartment.map(item => ({ id: item.id, name: item.itemName }))
    }

    if (this.selectedDesignation && this.selectedDesignation.length) {
      values.employee = values.employee || {}
      values.employee.designations = this.selectedDesignation.map(item => ({ id: item.id, name: item.itemName }))
    }

    if (this.selectedShiftType && this.selectedShiftType.length) {
      values.shiftType = this.selectedShiftType.map(item => ({ id: item.id, name: item.itemName }))
    }

    if (this.selectedAttendanceStatus && this.selectedAttendanceStatus.length) {
      values.attendance = values.attendance || {}
      values.attendance.status = this.selectedAttendanceStatus.map(item => ({ id: item.code, name: item.itemName }))
    }

    if (this.selectedCheckInStatus && this.selectedCheckInStatus.length) {
      values.attendance = values.attendance || {}
      values.attendance.checkIn = values.attendance.checkIn || {}
      values.attendance.checkIn.status = this.selectedCheckInStatus.map(item => ({ id: item.code, name: item.itemName }))
    }

    if (this.checkInBefore) {
      values.attendance = values.attendance || {}
      values.attendance.checkIn = values.attendance.checkIn || {}
      values.attendance.checkIn.before = this.checkInBefore
    }

    if (this.checkInBefore) {
      values.attendance = values.attendance || {}
      values.attendance.checkIn = values.attendance.checkIn || {}
      values.attendance.checkIn.after = this.checkInAfter
    }

    if (this.selectedCheckOutStatus && this.selectedCheckOutStatus.length) {
      values.attendance = values.attendance || {}
      values.attendance.checkOut = values.attendance.checkOut || {}
      values.attendance.checkOut.status = this.selectedCheckOutStatus.map(item => ({ id: item.code, name: item.itemName }))
    }

    if (this.checkOutBefore) {
      values.attendance = values.attendance || {}
      values.attendance.checkOut = values.attendance.checkOut || {}
      values.attendance.checkOut.before = this.checkOutBefore
    }

    if (this.checkOutBefore) {
      values.attendance = values.attendance || {}
      values.attendance.checkOut = values.attendance.checkOut || {}
      values.attendance.checkOut.after = this.checkOutAfter
    }

    if (this.selectedClockedStatus && this.selectedClockedStatus.length) {
      values.attendance = values.attendance || {}
      values.attendance.clocked = values.attendance.clocked || {}
      values.attendance.clocked.status = this.selectedClockedStatus.map(item => ({ id: item.code, name: item.itemName }))
    }

    if (this.clockedGreaterThan) {
      values.attendance = values.attendance || {}
      values.attendance.clocked = values.attendance.clocked || {}
      values.attendance.clocked.hours = values.attendance.clocked.hours || {}
      values.attendance.clocked.hours.greaterThan = this.clockedGreaterThan
    }

    if (this.clockedLessThan) {
      values.attendance = values.attendance || {}
      values.attendance.clocked = values.attendance.clocked || {}
      values.attendance.clocked.hours = values.attendance.clocked.hours || {}
      values.attendance.clocked.hours.lessThan = this.clockedLessThan
    }

    // this.selectedUserType.forEach(item => {
    //   values.employee.tags.push({
    //     id: item.id,
    //     name: item.itemName
    //   });
    // })
    // this.selectedContractor.forEach(item => {
    //   values.employee.tags.push({
    //     id: item.id,
    //     name: item.itemName
    //   });
    // })

    this.onChange.emit(values);
  }
}
