import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Leave } from '../../../models/leave';
import { LeaveBalance } from '../../../models/leave-balance';
import { Page } from '../../../common/contracts/page';
import { Model } from '../../../common/contracts/model';
import { LeavesComponent } from '../leaves/leaves.component';
import { LeaveType } from '../../../models/index';
import { ToastyService } from 'ng2-toasty';
import { Output } from '@angular/core/src/metadata/directives';
import { EventEmitter } from 'selenium-webdriver';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplyLeaveComponent } from '../apply-leave/apply-leave.component';

@Component({
  selector: 'aqua-apply-leave-type',
  templateUrl: './apply-leave-type.component.html',
  styleUrls: ['./apply-leave-type.component.css']
})
export class ApplyLeaveTypeComponent {

  startDate: string = ''
  endDate: string = ''
  days: number;
  bulkLeaves: {
    id: string,
    type: string,
    days: string
  }
  // bulkLeaves:[{
  //   id:string,
  //   type:string,
  //   days: number
  // }]


  @Input()
  leaveBalance: LeaveBalance;

  @Input()
  serial: any;

  @Input()
  empl: string;

  // @Output() allLeaves: EventEmitter = new EventEmitter();  

  leave: Leave;
  leaveBalances: Page<LeaveBalance>;
  duration: string = 'multi';
  endFirstHalf: boolean
  endSecondHalf: boolean
  startFirstHalf: boolean
  startSecondHalf: boolean

  constructor(
    private toastyService: ToastyService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) { }

  selected() {

    if (this.startDate && this.endDate) {
      let oneDay = 24 * 60 * 60 * 1000;
      let startDay: Date = new Date(this.startDate);
      if (this.startFirstHalf && this.startSecondHalf)
        startDay.setHours(0, 0, 0, 0);
      else if (this.endFirstHalf)
        startDay.setHours(12, 0, 0, 0);
      else if (this.endSecondHalf)
        startDay.setHours(12, 0, 0, 0);
      else
        return this.toastyService.info({ title: 'Info', msg: 'Select Half' })

      let endDay: Date = new Date(this.endDate);

      if (this.endFirstHalf && this.endSecondHalf)
        endDay.setHours(0, 0, 0, 0);
      else if (this.endFirstHalf)
        endDay.setHours(12, 0, 0, 0);
      else if (this.endSecondHalf)
        endDay.setHours(12, 0, 0, 0);
      else
        return this.toastyService.info({ title: 'Info', msg: 'Select Half' })

      if (endDay <= startDay) {
        return this.toastyService.info({ title: 'Info', msg: 'End Date should be greater then Start Date' })
      }
      if (this.endFirstHalf && this.endSecondHalf && this.startFirstHalf && this.startSecondHalf) {
        this.days = Math.abs(((endDay.getTime() - startDay.getTime()) / (oneDay)) + 1);
      }
      else
        this.days = Math.abs((endDay.getTime() - startDay.getTime()) / (oneDay));




      if (this.days > this.leaveBalance.days && !this.leaveBalance.leaveType.unlimited) {
        return this.toastyService.info({ title: 'Info', msg: `You don't have sufficient leave balance` })
      }

      if (this.leaveBalance.leaveType.monthlyLimit && this.days > this.leaveBalance.leaveType.monthlyLimit) {
        return this.toastyService.info({ title: 'Info', msg: `You cannot apply more than ${this.leaveBalance.leaveType.monthlyLimit} in a month` })
      }
      let lea: any = {
        id: this.leaveBalance.id,
        type: this.leaveBalance.leaveType,
        days: this.days
      }

      this.bulkLeaves = lea
      console.log(this.bulkLeaves)

      // this.allLeaves.emit(this.bulkLeaves);

      // console.log(this.days);
      // console.log(this.leaveBalance.leaveType.name)
      // return this.days;
    }
  }

  public approveLeave() {
    console.log(this.bulkLeaves)


  }

}
