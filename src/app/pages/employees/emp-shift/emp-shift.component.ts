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


@Component({
  selector: 'aqua-emp-shift',
  templateUrl: './emp-shift.component.html',
  styleUrls: ['./emp-shift.component.css']
})
export class EmpShiftComponent implements OnInit {

  @Input() code: string;
  effectiveShifts: Page<EffectiveShift>;
  effective: EffectiveShift
  dates: any = [];
  date = new Date()
  shiftTypes: Page<ShiftType>;
  currentShift: any;
  currentShiftDate: any;
  upcomingShift: any = [];
  show: boolean = false

  employee: Employee = new Employee();
  constructor(
    public activatedRoute: ActivatedRoute,
    private amsEmployeeService: AmsEmployeeService,
    private toastyService: ToastyService,
    private amsEffectiveShiftService: AmsEffectiveShiftService,
    private amsShiftService: AmsShiftService,


  ) {
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
      api: amsShiftService.shiftTypes
    });

    this.shiftTypes.fetch().catch((err) => {
      this.toastyService.error({ title: 'Error', msg: err })
    });
  }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.code) {
      this.getAmsDetails();
    }
  }

  getAmsDetails() {
    this.amsEmployeeService.employees
      .get(this.code)
      .then(amsEmployee => {
        this.employee = amsEmployee;
        // this.getLeaveBalance(this.employee.id)
        const date = new Date()
        // this.getEffectiveShift(date);

      });

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
        if (item.employee.code === this.code) {
          this.effective = item;
          // this.currentShift.date = this.effective.previousShift.date
          this.currentShift = this.effective.previousShift.shiftType.name
          this.currentShiftDate = this.effective.previousShift.date
          this.upcomingShift = this.effective.shifts
          console.log(this.currentShift);
          console.log(this.upcomingShift);
        }
      })
    })
      .catch(err => this.toastyService.error({ title: 'Error', msg: err }));

  }
  getAttendance() {
    this.shiftTypes.fetch().catch(err => this.toastyService.error({ title: 'Error', msg: err }));
    this.getEffectiveShift(this.date);

  }
  ngAfterViewInit() {
    this.getAttendance()
  }
}
