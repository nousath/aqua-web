import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'aqua-report-format',
  templateUrl: './report-format.component.html',
  styleUrls: ['./report-format.component.css']
})
export class ReportFormatComponent implements OnInit {

  reports: { sno: string, type: string, link: string }[];

  constructor() {

    this.reports = [{
      sno: '1',
      type: 'Attendance',
      link: 'assets/reports/Attendance.xlsx',
    }, {
      sno: '2',
      type: 'Biometric Fingerprint',
      link: 'assets/reports/Biometric-Fingerprint.xlsx',
    }, {
      sno: '3',
      type: 'Department',
      link: 'assets/reports/Department.xlsx',
    }, {
      sno: '4',
      type: 'Designation',
      link: 'assets/reports/Designation.xlsx',
    }, {
      sno: '5',
      type: 'Employee',
      link: 'assets/reports/Employee Format.xlsx',
    }, {
      sno: '6',
      type: 'Holiday',
      link: 'assets/reports/Holiday.xlsx',
    }, {
      sno: '7',
      type: 'Leave',
      link: 'assets/reports/Leave.xlsx',
    }, ]
  }

  ngOnInit() {
  }

}
