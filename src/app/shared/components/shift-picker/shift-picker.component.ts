import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ShiftType, EffectiveShift, Shift } from '../../../models/index';
import * as moment from 'moment';
import { AmsEffectiveShiftService, AmsEmployeeService } from '../../../services/ams';
import { ToastyService } from 'ng2-toasty';


@Component({
  selector: 'aqua-shift-picker',
  templateUrl: './shift-picker.component.html',
  styleUrls: ['./shift-picker.component.css']
})
export class ShiftPickerComponent implements OnInit {

  @Input()
  shiftTypes: ShiftType[];

  @Input()
  effectiveShift: EffectiveShift;

  @Input()
  date: Date;

  day: string;

  isDisabled = true;

  shiftSearch: string;

  startingShift: ShiftType;

  isProcessing = false;
  isWeeklyOff = false;
  isDynamic: Boolean;
  selectedShift: Shift;
  selectedShiftType: ShiftType;
  effectiveShiftType: ShiftType;

  days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

  constructor(
    private amsEmployeeService: AmsEmployeeService,
    private amsEffectiveShiftService: AmsEffectiveShiftService,
    private toastyService: ToastyService
  ) { }

  ngOnInit() {

    this.isDynamic = this.effectiveShift.employee.isDynamicShift;
    const pickerDate = new Date(this.date);

    this.isDisabled = pickerDate < new Date();
    this.day = this.days[this.date.getDay()]

    pickerDate.setHours(0, 0, 0, 0);
    if (this.effectiveShift.previousShift) {
      this.startingShift = this.effectiveShift.previousShift.shiftType
    }

    if (this.effectiveShift.employee.weeklyOff && this.effectiveShift.employee.weeklyOff.isConfigured) {
      this.isWeeklyOff = this.effectiveShift.employee.weeklyOff[this.day]
    }

    this.setEffectiveShift()

    this.effectiveShift.shifts.forEach(item => {

      const itemDate = new Date(item.date);
      itemDate.setHours(0, 0, 0, 0);

      if (itemDate.getTime() !== pickerDate.getTime()) { return; }
      this.selectedShift = item;

      this.shiftTypes.forEach(type => {
        if (type.id === this.selectedShift.shiftType.id) {
          this.selectedShift.shiftType = type;
          this.selectedShiftType = type;
        }
      })
    });
  }

  stopPropagation(event) {
    event.stopPropagation();
  }

  shiftColour = function () {
    let str = 'random';

    if (this.selectedShiftType && this.selectedShiftType.id) {
      str = this.selectedShiftType.id;
    } else if (this.effectiveShiftType && this.effectiveShiftType.id) {
      str = this.effectiveShiftType.id;
    }

    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let colour = '#';
    for (let i = 0; i < 3; i++) {
      let value = (hash >> (i * 8)) & 0xFF;
      colour += ('00' + value.toString(16)).substr(-2);
    }
    return colour;
  }

  reset() {
    if (this.selectedShift && this.selectedShift.shiftType) {
      this.isProcessing = true;
      this.amsEffectiveShiftService.effectiveShifts
        .remove(this.selectedShift.id)
        .then(() => {
          this.selectedShiftType = null;
          this.isProcessing = false;
        }).catch(err => {
          this.isProcessing = false;
          this.toastyService.error({ title: 'Error', msg: err })
        })
    }
  }

  setWeeklyOff() {
    const employee = this.effectiveShift.employee;
    this.isWeeklyOff = !this.isWeeklyOff;
    employee.weeklyOff[this.day] = this.isWeeklyOff

    if (this.isWeeklyOff) {
      employee.weeklyOff.isConfigured = true;
    }

    this.amsEmployeeService.employees
      .update(employee.id, employee)
      .then(() => {
        this.selectedShiftType = null;
        this.isProcessing = false;
      }).catch(err => {
        this.isProcessing = false;
        this.isWeeklyOff = !this.isWeeklyOff;
        this.toastyService.error({ title: 'Error', msg: err })
      });
  }

  setEffectiveShift() {
    this.effectiveShiftType = this.startingShift;

    let lastDate: Date;

    this.effectiveShift.shifts.forEach(item => {
      const mDate = moment(item.date);
      if (mDate.isBefore(this.date, 'd') && (!lastDate || mDate.isAfter(lastDate))) {
        lastDate = mDate.toDate();
        this.effectiveShiftType = item.shiftType
      }
    });
  }

  selectShift(newShiftType: ShiftType) {
    if (this.effectiveShiftType && newShiftType && this.effectiveShiftType.id === newShiftType.id) {
      this.selectedShiftType = null;

      if (this.selectedShift && this.selectedShift.shiftType && this.selectedShift.shiftType.id !== newShiftType.id) {

        this.isProcessing = true;
        this.amsEffectiveShiftService.effectiveShifts
          .remove(this.selectedShift.id)
          .then(() => {
            this.isProcessing = false;
          }).catch(err => {
            this.isProcessing = false;
            this.toastyService.error({ title: 'Error', msg: err })
          })
      }
      return;
    }

    const model: any = {
      date: this.date,
      shiftType: newShiftType
    };
    this.isProcessing = true;
    this.amsEffectiveShiftService.effectiveShifts
      .update(this.effectiveShift.employee.id, model)
      .then(() => {
        this.selectedShiftType = newShiftType;
        this.isProcessing = false;
      }).catch(err => {
        this.isProcessing = false;
        this.toastyService.error({ title: 'Error', msg: err })
      })
  }
}
