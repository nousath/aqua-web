import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Employee } from '../../../models';
import { AmsEmployeeService } from '../../../services/ams/ams-employee.service';

@Component({
  selector: 'aqua-week-off',
  templateUrl: './week-off.component.html',
  styleUrls: ['./week-off.component.css']
})
export class WeekOffComponent implements OnInit {

  @Input()
  employee: Employee;

  @Output()
  updated: EventEmitter<Employee> = new EventEmitter();
  isProcessing = false;

  weeklyOff: {
    monday: string,
    tuesday: string,
    wednesday: string,
    thursday: string,
    friday: string,
    saturday: string,
    sunday: string,
  };

  constructor(
    private amsEmployeeService: AmsEmployeeService
  ) { }

  ngOnInit() {
    this.initWeekOff();
  }

  initWeekOff() {
    const shiftType = this.employee.shiftType;
    this.weeklyOff = {
      monday: shiftType.monday,
      tuesday: shiftType.tuesday,
      wednesday: shiftType.wednesday,
      thursday: shiftType.thursday,
      friday: shiftType.friday,
      saturday: shiftType.saturday,
      sunday: shiftType.sunday
    }
      ;

    if (this.employee.weeklyOff.isConfigured) {
      if (this.employee.weeklyOff.monday) {
        this.weeklyOff.monday = 'off'
      }

      if (this.employee.weeklyOff.tuesday) {
        this.weeklyOff.tuesday = 'off'
      }

      if (this.employee.weeklyOff.wednesday) {
        this.weeklyOff.wednesday = 'off'
      }

      if (this.employee.weeklyOff.thursday) {
        this.weeklyOff.thursday = 'off'
      }

      if (this.employee.weeklyOff.friday) {
        this.weeklyOff.friday = 'off'
      }

      if (this.employee.weeklyOff.saturday) {
        this.weeklyOff.saturday = 'off'
      }

      if (this.employee.weeklyOff.sunday) {
        this.weeklyOff.sunday = 'off'
      }
    }
  }


  toggleWeeklyOff(day) {
    this.isProcessing = true;
    let isWeeklyOff = this.weeklyOff[day] === 'off';
    isWeeklyOff = !isWeeklyOff;

    this.employee.weeklyOff[day] = isWeeklyOff;

    if (isWeeklyOff) {
      this.employee.weeklyOff.isConfigured = true;
    }

    this.amsEmployeeService.employees
      .update(this.employee.id, this.employee)
      .then(() => {
        this.initWeekOff();
        this.updated.next();
        this.isProcessing = false;
      }).catch(err => {
        // TODO
      });
  }
}
