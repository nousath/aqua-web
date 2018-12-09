import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastyService } from 'ng2-toasty';
import { AmsShiftService } from '../../../services';
import { Model } from '../../../common/contracts/model';
import { ShiftType } from '../../../models';
import { ValidatorService } from '../../../services/validator.service';
import { Subscription } from 'rxjs/Rx';
import { Department } from '../../../models/department';
import { EmsDepartmentService } from '../../../services/ems';
import { ServerPageInput } from '../../../common/contracts/api/page-input';
import { Location } from '@angular/common';

@Component({
  selector: 'aqua-shift-type-new',
  templateUrl: './shift-type-new.component.html',
  styleUrls: ['./shift-type-new.component.css']
})
export class ShiftTypeNewComponent implements OnInit {

  shiftType: Model<ShiftType>;
  subscription: Subscription;
  shiftId: string;
  departments: Department[];
  departmentId: number;

  isNew = false;

  constructor(private amsShiftService: AmsShiftService,
    private toastyService: ToastyService,
    public validatorService: ValidatorService,
    private activatedRoute: ActivatedRoute,
    private emsDepartmentService: EmsDepartmentService,
    public _location: Location,
    private router: Router) {

    const deptFilter = new ServerPageInput();
    deptFilter.query = {
      divisionId: 1
    }
    emsDepartmentService.departments.search(deptFilter).then(departments => {
      this.departments = departments.items;
    });

    this.shiftType = new Model({
      api: amsShiftService.shiftTypes,
      properties: new ShiftType()
    });

    this.subscription = activatedRoute.params.subscribe(params => {
      this.shiftId = params['id'];
      if (!this.shiftId || this.shiftId === 'new') {
        this.isNew = true;
        return;
      }
      this.shiftType.fetch(this.shiftId).then(data => {
        let h: number, m: number;
        if (this.shiftType.properties.startTime) {
          h = new Date(this.shiftType.properties.startTime).getHours();
          m = new Date(this.shiftType.properties.startTime).getMinutes();
          this.shiftType.properties.startTime = `${h < 10 ? '0' + h : h}:${m < 10 ? '0' + m : m}`;
        }
        if (this.shiftType.properties.endTime) {
          h = new Date(this.shiftType.properties.endTime).getHours();
          m = new Date(this.shiftType.properties.endTime).getMinutes();
          this.shiftType.properties.endTime = `${h < 10 ? '0' + h : h}:${m < 10 ? '0' + m : m}`;
        }
      }
      ).catch(err => this.toastyService.error({ title: 'Error', msg: err }))
    });
  }

  save(isFormValid: boolean) {
    if (!isFormValid) {
      return this.toastyService.info({ title: 'Info', msg: 'Please fill all mandatory fields' })
    }

    const startTime: string[] = this.shiftType.properties.startTime.split(':');
    const endTime: string[] = this.shiftType.properties.endTime.split(':');
    const date = new Date();
    this.shiftType.properties.startTime = new Date(date.setHours(parseInt(startTime[0]), parseInt(startTime[1]))).toISOString();
    this.shiftType.properties.endTime = new Date(date.setHours(parseInt(endTime[0]), parseInt(endTime[1]))).toISOString();

    this.shiftType.save().then(
      data => this.router.navigate(['/settings/shifts'])
    ).catch(err => this.toastyService.error({ title: 'Error', msg: err }))

  }

  backClicked() {
    this._location.back();
  }

  ngOnInit() {
  }

}
