import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ShiftType, EffectiveShift, Shift } from '../../../models/index';



@Component({
  selector: 'aqua-shift-picker',
  templateUrl: './shift-picker.component.html',
  styleUrls: ['./shift-picker.component.css']
})
export class ShiftPickerComponent implements OnInit {

  isShow: boolean = false;

  @Input()
  shiftTypes: ShiftType[];

  @Input()
  effectiveShifts: Shift[];

  effectiveShift: Shift = new Shift();

  @Input()
  date: Date;

  @Output()
  onChange: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
    let pickerDate = new Date(this.date);
    pickerDate.setHours(0, 0, 0, 0);


    this.effectiveShifts.forEach(item => {

      let itemDate = new Date(item.date);
      itemDate.setHours(0, 0, 0, 0);

      if (itemDate.getTime() === pickerDate.getTime()) {
        this.effectiveShift = item;

        this.shiftTypes.forEach(type => {
          if (type.id === this.effectiveShift.shiftType.id) {
            this.effectiveShift.shiftType = type;
            this.isShow = true;
          }
        })
      }
    });

  }


  onShiftChange(shiftType: ShiftType) {
    this.onChange.emit(shiftType.id);
  }

}
