import { Component, OnInit } from '@angular/core';
import { AmsDeviceService, AmsOrganizationService } from '../../../services/ams';
import { MdDialog } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastyService } from 'ng2-toasty';
import { Page } from '../../../common/contracts/page';
import { Model } from '../../../common/contracts/model';
import { Device, Category } from '../../../models';
import { DeviceDialogComponent } from '../../../dialogs/device-dialog/device-dialog.component';
import { Machine } from '../../../models/category';

@Component({
  selector: 'aqua-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.css']
})
export class DevicesComponent implements OnInit {

  devices: Page<Device>;
  categories: Page<Category>;
  device: Model<Device>;

  constructor(private amsDeviceService: AmsDeviceService,
    private toastyService: ToastyService,
    private activatedRoute: ActivatedRoute,
    private orgService: AmsOrganizationService,
    private router: Router,
    public dialog: MdDialog) {

    this.devices = new Page({
      api: amsDeviceService.devices
    });

    this.device = new Model({
      api: amsDeviceService.devices,
      properties: new Device()
    });

    this.categories = new Page({
      api: amsDeviceService.categories
    });

    this.fetchDevices();
    this.categories.fetch().catch(err => toastyService.error({ title: 'Error', msg: err }));

  }

  fetchDevices() {
    this.devices.fetch().catch(err => this.toastyService.error({ title: 'Error', msg: err }));
  }

  saveDevice(device?: Device) {
    let dialogRef = this.dialog.open(DeviceDialogComponent, {
      width: '40%'
    });
    dialogRef.componentInstance.categories = this.categories.items;
    dialogRef.componentInstance.device = device ? device : new Device();
    if (device) { dialogRef.componentInstance.selectCat(device.category.id); }
    // dialogRef.componentInstance.device.machine = device.machine ? device.machine : new Machine();
    dialogRef.afterClosed().subscribe((data: Device) => {
      if (data) {
        this.device.properties = data;
        this.device.save().then(
          result => {
            this.fetchDevices();
          }
        ).catch(err => this.toastyService.error({ title: 'Error', msg: err }));
      }
    });
  }

  remove(device: Device) {
    this.device.properties = device;
    this.device.remove().then(
      result => {
        this.fetchDevices();
      }
    ).catch(err => this.toastyService.error({ title: 'Error', msg: err }));
  }

  isDownloading: boolean = false;
  activationKey: string = '';
  getActivationKey() {
    this.isDownloading = true;
    this.orgService.organizations.get('my').then(
      data => {
        this.activationKey = data.activationKey;
        this.isDownloading = false;
      }
    ).catch(err => { this.isDownloading = false; this.toastyService.error({ title: 'Error', msg: err }) });
  }

  copyKey() {
    let input: any = document.querySelector('#activationKey');
    input.select()
    try {
      let successful = document.execCommand('copy');
      let msg = successful ? 'successful' : 'unsuccessful';
      console.log('Copying text command was ' + msg);
    } catch (err) {
      console.log('Oops, unable to copy');
    }
  }

  // downloadSyncApp() {
  //   this.isDownloading = true;
  //   this.orgService.organizations.get('my').then(
  //     data => {
  //       this.orgService.downloadSyncApp.exportReport(null, `binaries/setup_${data.activationKey}.exe`).then(
  //         data => {
  //           this.isDownloading = false;
  //         }
  //       ).catch(err => { this.isDownloading = false; this.toastyService.error({ title: 'Error', msg: err }) });
  //     }
  //   ).catch(err => { this.isDownloading = false; this.toastyService.error({ title: 'Error', msg: err }) });
  // }

  ngOnInit() {
  }

}
