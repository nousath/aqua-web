import { Component, OnInit } from '@angular/core';
import { AmsShiftService } from '../../../services/ams/ams-shift.service';
import { ToastyService } from 'ng2-toasty';
import { ActivatedRoute, Router } from '@angular/router';
import { MdDialog } from '@angular/material';
import { Page } from '../../../common/contracts/page';
import { Shift } from '../../../models/shift';
import { ShiftType } from '../../../models/shift-type';
import { Model } from '../../../common/contracts/model';

@Component({
  selector: 'aqua-shifts',
  templateUrl: './shifts.component.html',
  styleUrls: ['./shifts.component.css']
})
export class ShiftsComponent implements OnInit {

  shifType: Model<ShiftType>;
  shifTypes: Page<ShiftType>;

  constructor(private amsShiftService: AmsShiftService,
    private toastyService: ToastyService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MdDialog) {

      // this.shifType = new Model({
      //   api: amsShiftService.shifts,
      //   properties: new Shift()
      // });


      this.shifType = new Model({
        api: amsShiftService.shiftTypes,
        properties: new ShiftType()
      });

    this.shifTypes = new Page({
      api: amsShiftService.shiftTypes
    });


    this.fetchShifTypes();


  }

  fetchShifTypes() {
    this.shifTypes.fetch().catch(err => this.toastyService.error({ title: 'Error', msg: err }));

  }

  ngOnInit() {
  }

 remove(item){
   this.shifType.properties = item;
   this.shifType.remove()
   .then(()=>{
     this.toastyService.info({ title: 'Info', msg: 'shift successfully delete' })
    })
    .catch(err => this.toastyService.error({ title: 'Error', msg: err }));
 }
}
