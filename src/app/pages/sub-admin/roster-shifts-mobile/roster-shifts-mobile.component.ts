import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { EffectiveShift } from '../../../models/index';
import { ShiftType } from '../../../models/shift-type';
import * as moment from 'moment';
import { ToastyService } from 'ng2-toasty';
import { AmsEffectiveShiftService } from '../../../services/index';
declare var $: any;


@Component({
  selector: 'aqua-roster-shifts-mobile',
  templateUrl: './roster-shifts-mobile.component.html',
  styleUrls: ['./roster-shifts-mobile.component.css']
})
export class RosterShiftsMobileComponent implements OnInit {

  @Input()
  effectiveShift: EffectiveShift[];

  @Output()
  dateChanged = new EventEmitter<Date>();

  @Output()
  dynamicEmployee = new EventEmitter<Date>();

  @Input()
  date: Date;

  currentDate: Date;

  effective: EffectiveShift[];
  // types: ShiftType[];
  mobileView = 'full';
  isFilter = false

  constructor(
    private toastyService: ToastyService,
    private amsEffectiveShiftService: AmsEffectiveShiftService,

  ) {

  }

  ngOnChanges() {
    if (this.effectiveShift.length) {
      this.getDetails(this.effectiveShift)
      // this.getDate()
    }
  }

  getDate() {
    $('#dateSelector').datepicker({
      format: 'dd/mm/yyyy',
      minViewMode: 0,
      maxViewMode: 2,
      autoclose: true,
      maxDate: new Date()
    }).on('changeDate', (e) => {
      this.date = e.date
      this.getDetails(this.effectiveShift)
      // this.dateChanged.emit(e.date)

    });
    $('#dateSelector').datepicker('setDate', this.date);
  }


  resetShifts() {
    this.amsEffectiveShiftService.effectiveShifts.simplePost({}, 'reset').then(() => {
      this.toastyService.info({ title: 'Status', msg: 'Submitted' })
    })
  }
  getDetails(effectiveShift: EffectiveShift[]) {
    this.effective = effectiveShift
    this.currentDate = this.date
  }

  toggleDynamicShift(employee) {
    this.dynamicEmployee.emit(employee);
  }
  ngOnInit() {
  }

}
