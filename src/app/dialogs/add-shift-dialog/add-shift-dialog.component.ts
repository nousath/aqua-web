import { Component, OnInit, Inject } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import { ShiftType } from '../../models/shift-type';
import { AmsEffectiveShiftService } from '../../services/index';
import { ToastyService } from 'ng2-toasty';
import * as moment from 'moment';
import { PagerModel } from '../../common/ng-structures/pager/pager.model';


@Component({
  selector: 'aqua-add-shift-dialog',
  templateUrl: './add-shift-dialog.component.html',
  styleUrls: ['./add-shift-dialog.component.css']
})
export class AddShiftDialogComponent implements OnInit {

  shiftTypes: PagerModel<ShiftType>;
  date = new Date()
  updated: boolean
  fromDate: any
  shift: string

  constructor(public dialogRef: MdDialogRef<AddShiftDialogComponent>,
    private amsEffectiveShiftService: AmsEffectiveShiftService,
    @Inject(MD_DIALOG_DATA) public data: { shifts: any, empId: string },
    private toastyService: ToastyService,
  ) { }

  changeShift(fromDate: Date, shiftId: string) {
    let selectedShift: ShiftType
    this.data.shifts.items.forEach(item => {
      if (item.id === shiftId) {
        selectedShift = item
      }
    })
    const model: any = {
      date: fromDate,
      shiftType: selectedShift
    };
    if (moment(fromDate).startOf('day').toISOString() >= moment(this.date).startOf('day').toISOString()) {
      this.amsEffectiveShiftService.effectiveShifts.update(this.data.empId, model)
      // this.addShift = !this.addShift;
    } else {
      this.toastyService.error({ title: 'Error', msg: 'Selected date should not be less than current date' })
    }
    this.dialogRef.close(this.updated = true);
  }


  ngOnInit() {
  }

}
