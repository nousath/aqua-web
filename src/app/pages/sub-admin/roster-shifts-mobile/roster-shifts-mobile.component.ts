import { Component, OnInit, Input } from '@angular/core';
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

  @Input()
  shiftTypes: ShiftType[];

  date: Date;
  currentDate: Date;

  effective: EffectiveShift[];
  types: ShiftType[];
  mobileView: string = 'full';
  isFilter: boolean = false

  constructor(
    private toastyService: ToastyService,
    private amsEffectiveShiftService: AmsEffectiveShiftService,

  ) {

  }

  ngOnChanges() {
    if (this.effectiveShift.length && this.shiftTypes.length) {
      this.getDate()
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
      this.getDetails(this.effectiveShift, this.shiftTypes)

    });
    $('#dateSelector').datepicker('setDate', new Date());
  }


  resetShifts() {
    this.amsEffectiveShiftService.effectiveShifts.simplePost({}, 'reset').then(() => {
      this.toastyService.info({ title: 'Status', msg: 'Submitted' })
    })
  }
  getDetails(effectiveShift: EffectiveShift[], shiftTypes: ShiftType[]) {
    console.log(effectiveShift)
    this.effective = effectiveShift
    this.types = shiftTypes
    this.currentDate = this.date
    console.log(this.effective)
    console.log(this.types)
  }

  ngOnInit() {
  }

}
