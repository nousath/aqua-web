import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ShiftType, EffectiveShift, Shift } from '../../../models/index';
import * as moment from 'moment';


@Component({
  selector: 'aqua-shift-picker',
  templateUrl: './shift-picker.component.html',
  styleUrls: ['./shift-picker.component.css']
})
export class ShiftPickerComponent implements OnInit {

  isShow = false;

  @Input()
  startingShift: ShiftType;

  @Input()
  shiftTypes: ShiftType[];

  @Input()
  effectiveShifts: Shift[];

  @Input()
  effectiveShift: Shift = new Shift();

  @Input()
  date: Date;

  @Output()
  onChange: EventEmitter<any> = new EventEmitter();

  selectedShiftType: ShiftType = new ShiftType();
  effectiveShiftType: ShiftType = new ShiftType();

  constructor() { }

  ngOnInit() {
    const pickerDate = new Date(this.date);
    pickerDate.setHours(0, 0, 0, 0);

    this.setEffectiveShift()


    this.effectiveShifts.forEach(item => {

      const itemDate = new Date(item.date);
      itemDate.setHours(0, 0, 0, 0);

      if (itemDate.getTime() === pickerDate.getTime()) {
        this.effectiveShift = item;

        this.shiftTypes.forEach(type => {
          if (type.id === this.effectiveShift.shiftType.id) {
            this.effectiveShift.shiftType = type;
            this.selectedShiftType = type;
            this.isShow = true;
          }
        })
      }
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

    this.effectiveShifts.forEach(item => {
      const mDate = moment(item.date);
      if (mDate.isBefore(this.date, 'd') && (!lastDate || mDate.isAfter(lastDate))) {
        lastDate = mDate.toDate();
        this.effectiveShiftType = item.shiftType
      }
    });
  }

  onShiftChange(shiftType: ShiftType) {
    if (this.effectiveShiftType && shiftType && this.effectiveShiftType.id === shiftType.id) {
      this.selectedShiftType = new ShiftType();

      if (this.effectiveShift && this.effectiveShift.shiftType && this.effectiveShift.shiftType.id !== shiftType.id) {
        // TODO: delete this change
        console.log('TODO: delete')
      }
      return;
    }


    this.onChange.emit(shiftType.id);
  }

}
