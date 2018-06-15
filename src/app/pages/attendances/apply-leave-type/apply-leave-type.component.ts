import { Component, OnInit, Input } from '@angular/core';
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

@Component({
  selector: 'aqua-apply-leave-type',
  templateUrl: './apply-leave-type.component.html',
  styleUrls: ['./apply-leave-type.component.css']
})
export class ApplyLeaveTypeComponent {
  firstHalf: boolean = true;

  startDate: string = ''
  endDate: string = ''

  @Input()
  leaveBalance: LeaveBalance;

  @Input()
  serial: any;

  @Input()
  empl: string;


  leave: Model<Leave>;
  leaveBalances: Page<LeaveBalance>;
  duration: string = 'multi';
  startTime: 'startFirstHalf' | 'startSecondHalf' | 'start1/3' | null = null
  endTime: 'endFirstHalf' | 'endSecondHalf' | 'end1/3' | null = null

  constructor(
    private toastyService: ToastyService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) { }

  selected() {

    if (this.firstHalf == false) {
      this.firstHalf = true;
      console.log(this.leaveBalance.id);
    }
    else
      this.firstHalf = false;
    console.log(this.leaveBalance.id);
  }

  public approveLeave() {
    this.leave.properties.date = this.startDate
    this.leave.properties.toDate = this.endDate
    

    if (this.leave.properties.date && this.leave.properties.toDate) {
      if (this.startTime && this.endTime) {
        let oneDay = 24 * 60 * 60 * 1000;
        let startDay: Date = new Date(this.leave.properties.date);
        switch (this.startTime) {
          case 'startFirstHalf' && 'startSecondHalf':
            startDay.setHours(0, 0, 0, 0);
            break;
          case 'startFirstHalf':
            startDay.setHours(12, 0, 0, 0);
            break;
          case 'startSecondHalf':
            startDay.setHours(12, 0, 0, 0);
            break;
        }

        let endDay: Date = new Date(this.leave.properties.toDate);

        switch (this.endTime) {
          case 'endFirstHalf' && 'endSecondHalf':
            endDay.setHours(0, 0, 0, 0);
          case 'endFirstHalf':
            endDay.setHours(12, 0, 0, 0);
            break;
          case 'endSecondHalf':
            endDay.setHours(12, 0, 0, 0);
            break;
        }
        if (endDay <= startDay) {
          return this.toastyService.info({ title: 'Info', msg: 'End Date should be greater then Start Date' })
        }
        this.leave.properties.days = Math.abs((endDay.getTime() - startDay.getTime()) / (oneDay));
        // this.leave.properties.toDate = new Date(this.leave.properties.toDate).toISOString();

        let totalLeaveBalace: LeaveBalance = this.leaveBalances.items.find((i: LeaveBalance) => {
          return i.leaveType.id == this.leave.properties.type.id
        });

        if (this.leave.properties.days > totalLeaveBalace.days && !totalLeaveBalace.leaveType.unlimited) {
          return this.toastyService.info({ title: 'Info', msg: `You don't have sufficient leave balance` })
        }

        if (totalLeaveBalace.leaveType.monthlyLimit && this.leave.properties.days > totalLeaveBalace.leaveType.monthlyLimit) {
          return this.toastyService.info({ title: 'Info', msg: `You cannot apply more than ${totalLeaveBalace.leaveType.monthlyLimit} in a month` })
        }
        this.leave.save().then(
          data => this.empl ? this.router.navigate(['../'], { relativeTo: this.activatedRoute }) : this.router.navigate(['../../'], { relativeTo: this.activatedRoute })
        ).catch(err => this.toastyService.error({ title: 'Error', msg: err }));

        return

      }

    }

  }


}
