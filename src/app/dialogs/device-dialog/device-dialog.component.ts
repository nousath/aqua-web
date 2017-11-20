import { Component, OnInit, ViewChild } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { ToastyService } from 'ng2-toasty';
import { Category, Machine } from '../../models/category';
import { Device } from '../../models/device';
import { NgForm } from '@angular/forms';
import { ValidatorService } from '../../services/validator.service';

@Component({
  selector: 'aqua-device-dialog',
  templateUrl: './device-dialog.component.html',
  styleUrls: ['./device-dialog.component.css']
})
export class DeviceDialogComponent implements OnInit {

  categories: Category[] = [];
  device: Device = new Device();
  machines: Machine[] = [];
  machineId: any;
  @ViewChild('deviceForm') deviceForm: NgForm;


  constructor(public dialogRef: MdDialogRef<DeviceDialogComponent>,
    public validatorService: ValidatorService,
    private toastyService: ToastyService) { }

  selectCat(id: string) {
    const cat: Category = this.categories.find((i: Category) => i.id === id);
    this.machines = cat ? cat.machines : [];
    this.device.category.name = cat.name;
  }

  selectMachine(id: string) {
    const machine: Machine = this.machines.find((i: Machine) => i.id === id);
    this.device.machine = machine ? machine : new Machine();
    this.machineId = this.device.machine.id;
    this.device.port = this.device.machine.port;
  }


  save() {

    if (this.deviceForm.valid) {
      if (!this.validatorService.ValidateIPaddress(this.device.ip))
        return this.toastyService.info({ title: 'Info', msg: "You have entered an invalid IP address!" })
      else
        this.dialogRef.close(this.device);
    } else {
      this.toastyService.info({ title: 'Info', msg: 'Please fill all mandatory filed properly' })
    }
  }

  ngOnInit() {
  }

}
