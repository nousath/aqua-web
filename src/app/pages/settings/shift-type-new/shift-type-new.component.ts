import { Component, OnInit, enableProdMode } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastyService } from 'ng2-toasty';
import { AmsShiftService } from '../../../services';
import { Model } from '../../../common/contracts/model';
import { ShiftType } from '../../../models';
import { ValidatorService } from '../../../services/validator.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs/Rx';
import { Department } from '../../../models/department';
import { EmsDepartmentService } from '../../../services/ems';

@Component({
  selector: 'aqua-shift-type-new',
  templateUrl: './shift-type-new.component.html',
  styleUrls: ['./shift-type-new.component.css']
})
export class ShiftTypeNewComponent implements OnInit {

  shifType: Model<ShiftType>;
  subscription: Subscription;
  shiftId: string;
  departments: Department[];
  departmentId: number;

  constructor(private amsShiftService: AmsShiftService,
    private toastyService: ToastyService,
    public validatorService: ValidatorService,
    private activatedRoute: ActivatedRoute,
    private emsDepartmentService: EmsDepartmentService,
    private router: Router) {
      
      emsDepartmentService.departments.search().then(departments => {
        this.departments = departments.items;
      });

    this.shifType = new Model({
      api: amsShiftService.shiftTypes,
      properties: new ShiftType()
    });

    this.subscription = activatedRoute.params.subscribe(
      params => {
        const id: string = params['id'];
        if (id) {
          this.shiftId = id;
          this.shifType.fetch(id).then(
            data => {
              let h: number, m: number;
              if (this.shifType.properties.startTime) {
                h = new Date(this.shifType.properties.startTime).getHours();
                m = new Date(this.shifType.properties.startTime).getMinutes();
                this.shifType.properties.startTime = `${h < 10 ? '0' + h : h}:${m < 10 ? '0' + m : m}`;
              }
              if (this.shifType.properties.endTime) {
                h = new Date(this.shifType.properties.endTime).getHours();
                m = new Date(this.shifType.properties.endTime).getMinutes();
                this.shifType.properties.endTime = `${h < 10 ? '0' + h : h}:${m < 10 ? '0' + m : m}`;
              }
            }
          ).catch(err => this.toastyService.error({ title: 'Error', msg: err }))
        }
      }
    );

  }

  save(isFormValid: boolean) {
    if (!isFormValid) {
      return this.toastyService.info({ title: 'Info', msg: 'Please fill all mandatory fields' })
    }

    const startTime: string[] = this.shifType.properties.startTime.split(':');
    const endTime: string[] = this.shifType.properties.endTime.split(':');
    const date = new Date();
    this.shifType.properties.startTime = new Date(date.setHours(parseInt(startTime[0]), parseInt(startTime[1]))).toISOString();
    this.shifType.properties.endTime = new Date(date.setHours(parseInt(endTime[0]), parseInt(endTime[1]))).toISOString();

    this.shifType.save().then(
      data => this.router.navigate(['/pages/settings/shifts'])
    ).catch(err => this.toastyService.error({ title: 'Error', msg: err }))

  }

  ngOnInit() {
  }

}
