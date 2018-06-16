import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ShiftType, EffectiveShift, Shift } from '../../../models/index';
import * as moment from 'moment';
import { AmsEffectiveShiftService } from '../../../services/ams';


@Component({
  selector: 'aqua-shift-picker',
  templateUrl: './shift-picker.component.html',
  styleUrls: ['./shift-picker.component.css']
})
export class ShiftPickerComponent implements OnInit {

  isShow = false;

  startingShift: ShiftType;

  isProcessing = false;

  @Input()
  shiftTypes: ShiftType[];


  @Input()
  effectiveShift: EffectiveShift;

  @Input()
  date: Date;



  selectedShift: Shift;
  selectedShiftType: ShiftType;
  effectiveShiftType: ShiftType;

  constructor(
    private amsEffectiveShiftService: AmsEffectiveShiftService
  ) { }

  ngOnInit() {
    const pickerDate = new Date(this.date);
    pickerDate.setHours(0, 0, 0, 0);
    if (this.effectiveShift.previousShift) {
      this.startingShift = this.effectiveShift.previousShift.shiftType
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
          this.isShow = true;
        }
      })
    });
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

  onShiftChange(newShiftType: ShiftType) {
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
        this.isProcessing = false;
      }).catch(err => {
        this.isProcessing = false;
      })
  }
}
