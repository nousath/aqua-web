import { Component, OnInit, ViewChild } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { ToastyService } from 'ng2-toasty';
import { Category, Machine } from '../../models/category';
import { Device } from '../../models/device';
import { NgForm } from '@angular/forms';
import { ValidatorService } from '../../services/validator.service';
import { parse } from 'url';
import { Mute } from '../../models/mute';

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
  showAvailable : boolean = false;
  isShowMuteOptions = false; 
  @ViewChild('deviceForm') deviceForm: NgForm;


  constructor(public dialogRef: MdDialogRef<DeviceDialogComponent>,
    public validatorService: ValidatorService,
    private toastyService: ToastyService) {
      console.log(this.device);
     }

  selectCat(id: string) {
    let cat: Category = this.categories.find((i: Category) => i.id == id);
    this.machines = cat ? cat.machines : [];
    this.device.category.name = cat.name;
  };

  selectMachine(id: string) {
    let machine: Machine = this.machines.find((i: Machine) => i.id == id);
    this.device.machine = machine ? machine : new Machine();
    this.machineId = this.device.machine.id;
    this.device.port = this.device.machine.port;
  };
  
  addTimeSlice(){
    this.device.mute.push(new Mute());
  }
  removeTimeSlice(item:Mute){
   this.device.mute.splice(this.device.mute.indexOf(item),1);
  }

  save() {      
    this.device.mute.forEach(item=>{
      let startCheckTimes: string[] = item.start.split(':');
      let endCheckTimes: string[] = item.end.split(':');
      item.start = new Date(new Date().setHours(parseInt(startCheckTimes[0]), parseInt(startCheckTimes[1]))).toISOString();
      item.end = new Date(new Date().setHours(parseInt(endCheckTimes[0]), parseInt(endCheckTimes[1]))).toISOString();
    })
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
      onChange(e: any) {
        if (e.checked == true) {
          this.isShowMuteOptions = true;
        } else {
          this.isShowMuteOptions = false;
        }
      }
    
  }

 
  


