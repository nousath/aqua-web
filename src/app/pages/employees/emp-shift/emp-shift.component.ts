import { Component, OnInit, Input } from '@angular/core';
import { Employee } from '../../../models/employee';
import { AmsEmployeeService, AmsEffectiveShiftService, AmsShiftService } from '../../../services/index';
import { EffectiveShift } from '../../../models/effective-shift';
import { Page } from '../../../common/contracts/page';
import * as moment from 'moment';
import { ToastyService } from 'ng2-toasty';
import { ActivatedRoute } from '@angular/router';
import { ShiftType } from '../../../models/shift-type';
import { forEach } from '@angular/router/src/utils/collection';
import { Shift } from '../../../models/index';
import { MdDialog } from '@angular/material';
import { AddShiftDialogComponent } from '../../../dialogs/add-shift-dialog/add-shift-dialog.component';


@Component({
  selector: 'aqua-emp-shift',
  templateUrl: './emp-shift.component.html',
  styleUrls: ['./emp-shift.component.css']
})
export class EmpShiftComponent implements OnInit {

  @Input() employee: Employee

  effectiveShifts: Page<EffectiveShift>;
  effective: EffectiveShift
  dates: any = [];
  date = new Date()
  shiftTypes: Page<ShiftType>;
  shift: ShiftType;
  currentShift: any;
  currentShiftDate: any;
  upcomingShift: any = [];
  // addShift: boolean = false


  // employee: Employee = new Employee();
  constructor(
    public activatedRoute: ActivatedRoute,
    private amsEmployeeService: AmsEmployeeService,
    private toastyService: ToastyService,
    private amsEffectiveShiftService: AmsEffectiveShiftService,
    private amsShiftService: AmsShiftService,
    public dialog: MdDialog) {
    this.effectiveShifts = new Page({
      api: amsEffectiveShiftService.effectiveShifts,
      filters: [{
        field: 'fromDate',
        value: this.date.toISOString()
      }, {
        field: 'name',
        value: this.activatedRoute.queryParams['value']['name']
      }]
    })
    this.shiftTypes = new Page({
      api: amsShiftService.shiftTypes,
      filters: [{
        field: 'employeeId'
      }]
    });

    // this.shiftTypes.fetch().catch((err) => {
    //   this.toastyService.error({ title: 'Error', msg: err })
    // });
  }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.employee) {
      this.getAttendance()
    }
  }

  toggleDynamicShift(employee: Employee) {
    this.amsEmployeeService.toggleDynamicShift(employee).subscribe(item =>
      this.employee.isDynamicShift = item.isDynamicShift)
  }


  applyFilters($event) {
    this.effectiveShifts.filters.properties['shiftType']['value'] = $event.shiftType ? $event.shiftType.id : null;
    this.effectiveShifts.filters.properties['name']['value'] = $event.employeeName;
    this.effectiveShifts.filters.properties['code']['value'] = $event.employeeCode;
    this.effectiveShifts.filters.properties['tagIds']['value'] = $event.tagIds;
  }

  getWeek(currentDate) {
    this.dates = [];
    let startOfWeek = moment(currentDate).startOf('week')
    const endOfWeek = moment(currentDate).endOf('week')
    while (startOfWeek <= endOfWeek) {
      this.dates.push(startOfWeek.toDate());
      startOfWeek = startOfWeek.clone().add(1, 'd');
    }
  }

  nextWeek() {
    this.date = moment(this.date).add(7, 'd').toDate()
    this.getAttendance()
  }

  previousWeek() {
    this.date = moment(this.date).add(-7, 'd').toDate()
    this.getAttendance()
  }

  getEffectiveShift(date: Date) {
    // this.isLoading = true;
    this.effectiveShifts.filters.properties['name']['value'] = this.employee.name;

    this.effectiveShifts.filters.properties['fromDate']['value'] = moment(date).startOf('week').toISOString();
    this.effectiveShifts.fetch().then(() => {
      this.getWeek(date);
      // this.isLoading = false;
      this.effectiveShifts.items.forEach(item => {
        if (item.employee.code) {
          this.effective = item;
          // this.currentShift.date = this.effective.previousShift.date
          this.currentShift = this.effective.previousShift.shiftType
          this.currentShiftDate = this.effective.previousShift.date
          this.upcomingShift = this.effective.shifts
        }
      })
    })
      .catch(err => this.toastyService.error({ title: 'Error', msg: err }));

  }
  getAttendance() {
    this.shiftTypes.filters.properties['employeeId'].value = this.employee.id;
    this.shiftTypes.fetch().catch(err => this.toastyService.error({ title: 'Error', msg: err }));
    this.getEffectiveShift(this.date);

  }


  addShift() {
    const dialog = this.dialog.open(AddShiftDialogComponent, { data: { shifts: this.shiftTypes, empId: this.employee.id } })
    dialog.afterClosed().subscribe((updated: boolean) => {
      if (updated === true)
        this.getEffectiveShift(this.date)
    })
  }

  removeShift(shift: Shift) {
    this.amsEffectiveShiftService.effectiveShifts
      .remove(shift.id)
    this.getEffectiveShift(this.date);

  }
  ngAfterViewInit() {
  }
}
