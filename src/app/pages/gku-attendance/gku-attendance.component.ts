import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { EmsEmployeeService } from '../../services/ems/ems-employee.service';
import { AmsEmployeeService } from '../../services';
import { LocalStorageService } from '../../services/local-storage.service';
import { ToastyService } from 'ng2-toasty';
import { DayEvent } from '../../models/day-event';
import * as _ from 'lodash';
import { Shift } from '../../models/shift';
import { ServerPageInput } from '../../common/contracts/api/page-input';
import { IGetParams } from '../../common/contracts/api/get-params.interface';
import { AmsAttendanceService } from '../../services/ams/ams-attendance.service';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'aqua-gku-attendance',
  templateUrl: './gku-attendance.component.html',
  styleUrls: ['./gku-attendance.component.css']
})
export class GkuAttendanceComponent implements OnInit, OnDestroy {
  selectedDate: Date = new Date();
  isProcessingAttendance: boolean;
  subscription: Subscription;

  days: string[] = ['Mon', 'Tue', 'wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  events: DayEvent[] = [];
  emptyStartDays: any[] = [];
  emptyEndDays: any[] = [];

  constructor(private activatedRoute: ActivatedRoute,
    private emsEmployeeService: EmsEmployeeService,
    private amsEmployeeService: AmsEmployeeService,
    private amsAttendanceService: AmsAttendanceService,
    private store: LocalStorageService,
    private toastyService: ToastyService,
    private meta: Meta) {

      // this.meta.addTag({ name: 'viewport', content: 'width=device-width, initial-scale=1' }, true);
      this.meta.addTag({ name: 'viewport', content: 'width=400' }, true);

    this.subscription = activatedRoute.params.subscribe(
      params => {
        this.isProcessingAttendance = true;
        const externalToken: string = params['token'];
        let orgCode: string = params['orgCode'];
        if (!externalToken || !orgCode) {
          return alert('Token or Org Not Found')
        }

        orgCode = orgCode.toLowerCase();
        this.store.clear();
        this.store.setItem('external-token', externalToken);
        this.store.setItem('orgCode', orgCode);
        this.login();
      }
    );
  }



  login() {
    const tempData: any = { 'device': { 'id': 'string' } };
    this.amsEmployeeService.signInViaExternalToken.create(tempData).then(
      (amsUser) => {
        this.store.setItem('ams_token', amsUser.token);
        amsUser.userType = 'superadmin';
        this.store.setObject('user', amsUser);
        this.isProcessingAttendance = false;
        this.getAttendance(amsUser.id);
      }
    ).catch(err => { this.toastyService.error({ title: 'Error', msg: err }) });
  }


  getAttendance(empId: string) {
    this.selectedDate = new Date()
    this.isProcessingAttendance = true;
    const date = new Date();
    const y = date.getFullYear(), m = date.getMonth();
    const firstDay = new Date(y, m, 1);
    const lastDay = new Date(y, m + 1, 1);

    const serverPageInput: ServerPageInput = new ServerPageInput();
    serverPageInput.query['fromDate'] = firstDay.toISOString();
    serverPageInput.query['toDate'] = lastDay.toISOString();
    serverPageInput.query['employee'] = empId;
    const param: IGetParams = {
      serverPageInput: serverPageInput
    };

    this.amsAttendanceService.attendance.simpleGet(param).then((data: DayEvent[]) => {
      this.events = [];
      let startDay = new Date(firstDay).getDay();
      startDay = startDay === 0 ? 7 : startDay;

      const dateVar: Date = new Date(this.selectedDate);
      const year: number = dateVar.getFullYear();
      const monthInNumber: number = dateVar.getMonth();
      // let totalDaysInMonth: number;

      // _.each(this.months, (value: Month, key: string, obj: Months) => {
      //   if (value.id === m + 1)
      //     totalDaysInMonth = value.days;
      // });

      const lastDateOfMonth: Date = new Date(y, monthInNumber + 1, 0);

      const lastDayOfMonth = lastDateOfMonth.getDate();

      const days: number[] = [];
      for (let i = 0; i < lastDayOfMonth; i++) {
        days.push(i);
      }

      _.each(days, (day: number) => {
        let dateEvent: DayEvent;

        dateEvent = _.find(data, (item: DayEvent) => {
          return new Date(item.ofDate).getDate() === day + 1;
        });

        if (dateEvent) {
          if (!dateEvent.shift) {
            dateEvent['shift'] = new Shift();
            dateEvent.shift.status = 'working';
          }
          dateEvent.status = dateEvent.status ? dateEvent.status.toLowerCase() : '';
          dateEvent.shift.status = dateEvent.shift.status ? dateEvent.shift.status.toLowerCase() : '';
          this.events.push(dateEvent)
        } else {
          const newEvent: DayEvent = new DayEvent();
          newEvent.ofDate = new Date(year, monthInNumber, day + 1).toISOString();
          this.events.push(newEvent);
        }
      })



      this.emptyStartDays = [];
      for (let i = 1; i < startDay; i++) {
        this.emptyStartDays.push(i);
      }
      // this.events = data;
      this.isProcessingAttendance = false;

    }).catch(err => {
      this.isProcessingAttendance = false;
      this.toastyService.error({ title: 'Error', msg: err });
    });
  }

  getDate(date: Date): number {
    return new Date(date).getDate()
  };

  ngOnInit() {
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
