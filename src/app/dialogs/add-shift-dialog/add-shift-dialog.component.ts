import { Component, OnInit, Inject } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import { ShiftType } from '../../models/shift-type';
import { Page } from '../../common/contracts/page';
import { AmsEffectiveShiftService } from '../../services/index';
import { ToastyService } from 'ng2-toasty';
import * as moment from 'moment';


@Component({
  selector: 'aqua-add-shift-dialog',
  templateUrl: './add-shift-dialog.component.html',
  styleUrls: ['./add-shift-dialog.component.css']
})
export class AddShiftDialogComponent implements OnInit {

  shiftTypes: Page<ShiftType>;
  date = new Date()
  updated: boolean

  constructor(public dialogRef: MdDialogRef<AddShiftDialogComponent>,
    private amsEffectiveShiftService: AmsEffectiveShiftService,
    @Inject(MD_DIALOG_DATA) private data: { shifts: any, empId: string },
    private toastyService: ToastyService,
  ) {
    console.log(this.data)
   }

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
    if (moment(fromDate).startOf('day').toISOString() > moment(this.date).startOf('day').toISOString()) {
      this.amsEffectiveShiftService.effectiveShifts.update(this.data.empId, model)
      // this.addShift = !this.addShift;
    } else {
      this.toastyService.error({ title: 'Error', msg: 'Selected date should be greater than current date' })
    }
    this.dialogRef.close(this.updated = true);
  }


  ngOnInit() {
  }

}
