import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ValidatorService, AmsShiftService, AutoCompleteService, EmsAuthService } from '../../../services';
import { ShiftType } from '../../../models/shift-type';
import { Designation, Employee, Contractor } from '../../../models';
import { EmsDesignationService } from '../../../services/ems/ems-designation.service';
import { Department } from '../../../models/department';
import { EmsDepartmentService } from '../../../services/ems/ems-department.service';
import { Division } from '../../../models/division';
import { EmsDivisionService } from '../../../services/ems/ems-division.service';
import { EmsContractorService } from '../../../services/ems/ems-contractor.service';
import * as moment from 'moment';
import { Observable } from 'rxjs/Observable';
import { PageOptions } from '../../../common/ng-api';

@Component({
  selector: 'aqua-employees-filter',
  templateUrl: './employees-filter.component.html',
  styleUrls: ['./employees-filter.component.css']
})
export class EmployeesFilterComponent implements OnInit, OnChanges {


  departments: Department[];
  departmentId: number;
  divisions: Division[];
  divisionId: number;
  designations: Designation[];
  designationsId: number;
  contractors: Contractor[];
  contractorId: number;
  shiftTypes: ShiftType[];
  userDiv: any;
  @Input()
  fields: any[] = [];

  @Input()
  isStatus: string[] = [];

  @Input()
  fromDate: Date;
  @Input()
  statusFilter: string[] = [];

  @Input()
  tillDate: Date;

  @Input()
  terminationDate: Date;

  @Input()
  joiningDate: Date;

  @Input()
  selectedEmployeeName: string;

  @Input()
  selectedEmployeeCode: string;

  @Input()
  selectedEmployeeBiometricId: string;
  selectedEmployeeType: string;
  selectedTerminationReason: string;
  selectedAttendanceStatus = [];
  selectedCheckInStatus = [];
  selectedCheckOutStatus = [];
  selectedClockedStatus = [];
  selectedDesignation = [];
  selectedDepartment = [];
  selectedDivision = [];
  selectedUserType = [];
  selectedEmployeeStatusList = [];
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
    terminationDate?: boolean,
    joiningDate?: boolean,
    terminationReason?: boolean,
    month?: boolean,
    name?: boolean,
    code?: boolean,
    biometricId?: boolean,
    userTypes?: boolean,
    designations?: boolean,
    departments?: boolean,
    divisions?: boolean,
    contractors?: boolean,
    supervisor?: boolean,
    employeeTypes?: boolean,
    employeeStatus?: boolean,
    shiftTypes?: boolean,
    attendanceStates?: boolean,

    clocked?: boolean,
    checkIn?: boolean,
    checkOut?: boolean
  }
  divisionList = [];
  departmentList = [];
  designationList = [];
  userTypeList = [];
  contractorList = [];

  shiftTypesList = [];

  attendanceStatusList = [];
  checkInStatusList = [];
  checkOutStatusList = [];
  employeeTypeList = [];
  employeeStatusList = [];
  terminationReasonList = [];
  clockedStatusList = [];

  dropdownSettings = {};

  constructor(
    private emsContractorService: EmsContractorService,
    private emsDepartmentService: EmsDepartmentService,
    private emsDivisionService: EmsDivisionService,
    private emsDesignationService: EmsDesignationService,
    private autoCompleteService: AutoCompleteService,
    private auth: EmsAuthService,
    public validatorService: ValidatorService,
    private amsShiftService: AmsShiftService,
  ) {
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

    this.employeeTypeList = [
      { id: 1, code: 'permanent', itemName: 'Permanent' },
      { id: 2, code: 'contract', itemName: 'Contract' }
    ]

    this.employeeStatusList = [
      { id: 1, code: 'active', itemName: 'Active' },
      { id: 2, code: 'inactive', itemName: 'Deactivate' },
      { id: 3, code: 'archived', itemName: 'Archived' }
    ]
    this.terminationReasonList = [
      { id: 1, code: 'resign', itemName: 'Resign' },
      { id: 2, code: 'terminate', itemName: 'Terminate' },
      { id: 3, code: 'absconding', itemName: 'Absconding' },
      { id: 4, code: 'death', itemName: 'Death' }
    ]

    this.clockedStatusList = [
      { id: 1, code: 'short', itemName: 'Short' },
      { id: 2, code: 'extra', itemName: 'Extra' }
    ]

    this.userTypeList = [
      { id: 1, code: 'normal', itemName: 'Normal' },
      { id: 2, code: 'admin', itemName: 'Supervisor' },
      { id: 3, code: 'superadmin', itemName: 'Super Admin' }
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
  }

  ngOnChanges(changes: SimpleChanges): void {

    const show = {
    }

    let hasFieldsChanged = false;

    this.fields.forEach(item => {
      const field = item.field || item
      show[field] = true;

      if (item.value !== undefined) {
        switch (field) {
          case 'attendanceStates':

            const value = this.attendanceStatusList.find(i => i.code === item.value)
            if (value) {
              this.selectedAttendanceStatus = [];
              this.selectedAttendanceStatus.push(value)
            }
            break;
        }
      }

      if (this.show && this.show[field] !== show[field]) {
        hasFieldsChanged = true;
      }
    });

    this.show = show

    if (this.fromDate) {
      this.show.checkOut = moment(this.fromDate).isBefore(new Date(), 'd');
      this.show.clocked = moment(this.fromDate).isBefore(new Date(), 'd');
    }
    if (hasFieldsChanged) {
      this.reset();
    }
  }

  ngOnInit() {

    this.hidden = this.hidden || {};


    if (this.fromDate) {
      this.show.checkOut = moment(this.fromDate).isBefore(new Date(), 'd');
    }

    if (this.show.divisions) {
      this.getDivisions();
    }
    if (this.show.departments) {
      this.getDepartments();
    }
    if (this.show.contractors) {
      this.getContractors();
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
    const designationFilter = new PageOptions();
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
  getUserDivision() {
    this.userDiv = this.auth.currentRole().employee.division
    if (this.userDiv && this.userDiv.name && this.userDiv.code && this.userDiv.code !== 'default') {
      const exists = {
        id: this.userDiv.id,
        itemName: this.userDiv.name,
      };
      this.selectedDivision.push(exists);
    }
  }
  private getDivisions() {
    const divisionFilter = new PageOptions();
    this.emsDivisionService.divisions.search(divisionFilter).then(page => {
      this.divisions = page.items;
      this.divisionList = [];
      this.divisions.forEach(item => {
        const obj = {
          id: item.id,
          itemName: item.name,
        };
        this.divisionList.push(obj);
      })
      this.getUserDivision()
    });
  }
  private getDepartments() {
    const deptFilter = new PageOptions();
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
  private getContractors() {
    const contractorFilter = new PageOptions();
    this.emsContractorService.contractors.search(contractorFilter).then(page => {
      this.contractors = page.items;
      this.contractorList = [];
      this.contractors.forEach(item => {
        const obj = {
          id: item.id,
          itemName: item.name,
          itemCode: item.code
        };
        this.contractorList.push(obj);
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
    this.selectedDesignation = [];
    this.selectedDepartment = [];
    this.selectedDivision = [];
    this.selectedUserType = [];
    this.selectedEmployeeStatusList = [];
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
    this.selectedEmployeeBiometricId = null;
    this.selectedEmployeeType = null;
    this.selectedTerminationReason = null;
    this.selectedSupervisor = null;
    this.terminationDate = null;
    this.joiningDate = null;
    this.onReset.emit();
  }

  apply() {
    const params: any = {}
    const values: any = {}
    if (this.fromDate) {
      params.dates = params.dates || {}
      params.dates.from = this.fromDate
      values.fromDate = this.fromDate;
    }

    if (this.tillDate) {
      params.dates = params.dates || {}
      params.dates.till = this.tillDate
      values.tillDate = this.tillDate;
    }

    if (this.terminationDate) {
      params.dates = params.dates || {}
      params.dates.terminationDate = this.terminationDate
      values.terminationDate = this.terminationDate;
    }

    if (this.joiningDate) {
      params.dates = params.dates || {}
      params.dates.joiningDate = this.joiningDate
      values.joiningDate = this.joiningDate;
    }

    if (this.selectedEmployeeName) {
      params.employee = params.employee || {}
      params.employee.name = this.selectedEmployeeName
      values.employeeName = this.selectedEmployeeName;

    }

    if (this.selectedEmployeeCode) {
      params.employee = params.employee || {}
      params.employee.code = this.selectedEmployeeCode
      values.employeeCode = this.selectedEmployeeCode;
    }

    if (this.selectedEmployeeBiometricId) {
      params.employee = params.employee || {}
      params.employee.biometricId = this.selectedEmployeeBiometricId
      values.employeeBiometricId = this.selectedEmployeeBiometricId;
    }

    if (this.selectedSupervisor) {
      params.employee = params.employee || {}
      params.employee.supervisor = {
        id: this.selectedSupervisor.id,
        code: this.selectedSupervisor.code,
        name: this.selectedSupervisor.name
      }

      values.supervisorId = this.selectedSupervisor.id;
    }

    // if (this.selectedContractor && this.selectedContractor.length) {
    //   params.employee = params.employee || {}
    //   params.employee.contractors = this.selectedContractor.map(item => ({ id: item.id, name: item.itemName, code: item.itemCode }))
    //   values.contractors = this.selectedContractor.map(item => item.id)
    // }

    if (this.selectedUserType && this.selectedUserType.length) {
      params.employee = params.employee || {}
      params.employee.userTypes = this.selectedUserType
      values.userTypes = this.selectedUserType
    }

    if (this.selectedEmployeeStatusList && this.selectedEmployeeStatusList.length) {
      params.employee = params.employee || {}
      params.employee.employeeStatus = this.selectedEmployeeStatusList.map(item => ({ id: item.id, name: item.itemName, code: item.code }))
      values.employeeStatus = this.selectedEmployeeStatusList.map(item => item.id)
    }


    if (this.selectedTerminationReason && this.selectedTerminationReason.length) {
      params.employee = params.employee || {}
      params.employee.terminationReason = this.selectedTerminationReason
      values.terminationReason = this.selectedTerminationReason
    }

    if (this.selectedEmployeeType && this.selectedEmployeeType.length) {
      params.employee = params.employee || {}
      params.employee.employeeTypes = this.selectedEmployeeType
      values.employeeTypes = this.selectedEmployeeType
    }
    if (this.selectedDivision && this.selectedDivision.length) {
      params.employee = params.employee || {}
      params.employee.divisions = this.selectedDivision.map(item => ({ id: item.id, name: item.itemName }))
      values.divisionIds = this.selectedDivision.map(item => ({ id: item.id, name: item.itemName }))
      values.divisionNames = this.selectedDivision.map(item => item.itemName)
    }
    if (this.selectedDepartment && this.selectedDepartment.length) {
      params.employee = params.employee || {}
      params.employee.departments = this.selectedDepartment.map(item => ({ id: item.id, name: item.itemName }))
      values.departmentIds = this.selectedDepartment.map(item => ({ id: item.id, name: item.itemName }))
      values.departmentNames = this.selectedDepartment.map(item => item.itemName)
    }
    if (this.selectedContractor && this.selectedContractor.length) {
      params.employee = params.employee || {}
      params.employee.contractors = this.selectedContractor.map(item => ({ id: item.id, name: item.itemName, code: item.itemCode }))
      values.contractorIds = this.selectedContractor.map(item => ({ id: item.id, name: item.itemName }))
      values.contractorNames = this.selectedContractor.map(item => item.itemName)
    }

    if (this.selectedDesignation && this.selectedDesignation.length) {
      params.employee = params.employee || {}
      params.employee.designations = this.selectedDesignation.map(item => ({ id: item.id, name: item.itemName }))
      values.designationIds = this.selectedDesignation.map(item => ({ id: item.id, name: item.itemName }))
      values.designationNames = this.selectedDesignation.map(item => item.itemName)
    }

    if (this.selectedShiftType && this.selectedShiftType.length) {
      params.shiftType = this.selectedShiftType.map(item => ({ id: item.id, name: item.itemName }))
      params.shiftTypes = params.shiftType
      values.shiftTypeIds = this.selectedShiftType.map(item => item.id)
    }

    if (this.selectedAttendanceStatus && this.selectedAttendanceStatus.length) {
      params.attendance = params.attendance || {}
      params.attendance.states = this.selectedAttendanceStatus.map(item => ({ code: item.code, name: item.itemName }))
      values.attendanceStates = this.selectedAttendanceStatus.map(item => item.code)
    }

    if (this.selectedCheckInStatus && this.selectedCheckInStatus.length) {
      params.attendance = params.attendance || {}
      params.attendance.checkIn = params.attendance.checkIn || {}
      params.attendance.checkIn.states = this.selectedCheckInStatus.map(item => ({ code: item.code, name: item.itemName }))
      values.checkInStates = this.selectedCheckInStatus.map(item => item.code)
    }

    if (this.checkInBefore) {
      params.attendance = params.attendance || {}
      params.attendance.checkIn = params.attendance.checkIn || {}
      params.attendance.checkIn.before = this.checkInBefore
      values.checkInBefore = this.checkInBefore
    }

    if (this.checkInAfter) {
      params.attendance = params.attendance || {}
      params.attendance.checkIn = params.attendance.checkIn || {}
      params.attendance.checkIn.after = this.checkInAfter
      values.checkInAfter = this.checkInAfter
    }

    if (this.selectedCheckOutStatus && this.selectedCheckOutStatus.length) {
      params.attendance = params.attendance || {}
      params.attendance.checkOut = params.attendance.checkOut || {}
      params.attendance.checkOut.states = this.selectedCheckOutStatus.map(item => ({ code: item.code, name: item.itemName }))
      values.checkOutStates = this.selectedCheckOutStatus.map(item => item.code)
    }

    if (this.checkOutBefore) {
      params.attendance = params.attendance || {}
      params.attendance.checkOut = params.attendance.checkOut || {}
      params.attendance.checkOut.before = this.checkOutBefore
      values.checkOutBefore = this.checkOutBefore
    }

    if (this.checkOutAfter) {
      params.attendance = params.attendance || {}
      params.attendance.checkOut = params.attendance.checkOut || {}
      params.attendance.checkOut.after = this.checkOutAfter
      values.checkOutAfter = this.checkOutAfter
    }

    if (this.selectedClockedStatus && this.selectedClockedStatus.length) {
      params.attendance = params.attendance || {}
      params.attendance.clocked = params.attendance.clocked || {}
      params.attendance.clocked.states = this.selectedClockedStatus.map(item => ({ code: item.code, name: item.itemName }))
      values.clockedStates = this.selectedClockedStatus.map(item => item.code)

    }

    if (this.clockedGreaterThan) {
      params.attendance = params.attendance || {}
      params.attendance.clocked = params.attendance.clocked || {}
      params.attendance.clocked.hours = params.attendance.clocked.hours || {}
      params.attendance.clocked.hours.greaterThan = this.clockedGreaterThan
      values.clockedGreaterThan = this.clockedGreaterThan
    }

    if (this.clockedLessThan) {
      params.attendance = params.attendance || {}
      params.attendance.clocked = params.attendance.clocked || {}
      params.attendance.clocked.hours = params.attendance.clocked.hours || {}
      params.attendance.clocked.hours.lessThan = this.clockedLessThan
      values.clockedLessThan = this.clockedLessThan
    }


    this.onChange.emit({
      values: values,
      params: params
    });
  }
}
