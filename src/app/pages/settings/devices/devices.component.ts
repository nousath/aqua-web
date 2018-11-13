import { Component, OnInit, style } from '@angular/core';
import { AmsDeviceService, AmsOrganizationService } from '../../../services/ams';
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { MdDialog } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastyService } from 'ng2-toasty';
import { Page } from '../../../common/contracts/page';
import { Model } from '../../../common/contracts/model';
import { Device, Category } from '../../../models';
import { DeviceDialogComponent } from '../../../dialogs/device-dialog/device-dialog.component';
import { SyncDialogComponent } from '../../../dialogs/sync-dialog/sync-dialog.component';
import { Machine } from '../../../models/category';
import { LocalStorageService } from '../../../services/local-storage.service';
import { ConfirmDialogComponent } from '../../../dialogs/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'aqua-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.css']
})
export class DevicesComponent implements OnInit {

  devices: Page<Device>;
  categories: Page<Category>;
  device: Model<Device>;
  isUpload = false;
  uploader: FileUploader;
  deviceId: string;

  isDownloading = false;
  activationKey = '';

  constructor(private amsDeviceService: AmsDeviceService,
    private toastyService: ToastyService,
    private activatedRoute: ActivatedRoute,
    private orgService: AmsOrganizationService,
    private store: LocalStorageService,
    private router: Router,
    public dialog: MdDialog) {

    const access_Token: string = this.store.getItem('ams_token');
    const orgCode = this.store.getItem('orgCode');

    this.uploader = new FileUploader({
      // url: `/ams/api/devices/${this.deviceId}/logs`,
      url: `localhost:3040/api/devices/${this.deviceId}/logs`,
      itemAlias: 'file',
      headers: [{
        name: 'x-access-token',
        value: access_Token
      }, {
        name: 'org-code',
        value: orgCode
      }]
    });


    this.uploader.onErrorItem = (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
      console.log('onErrorItem', response, headers);
    };

    this.uploader.onCompleteItem = (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
      console.log(response);
      const res: any = JSON.parse(response);
      if (!res.isSuccess) {
        return toastyService.error({ title: 'Error', msg: 'excel upload failed' })
      }
      this.isUpload = false;

    };

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
    this.devices.fetch(
      function (err, page) {
        if (!err) {
          let h: number, m: number;
          page.items.forEach(device => {
            if (!device.type) {
              device.type = 'both';
            }
            if (device.mute && device.mute.length > 0) {
              device.mute.forEach(dt => {
                if (dt.start != null) {
                  h = new Date(dt.start).getHours();
                  m = new Date(dt.start).getMinutes();
                  dt.start = `${h < 10 ? '0' + h : h}:${m < 10 ? '0' + m : m}`;
                }
                if (dt.end != null) {
                  h = new Date(dt.end).getHours();
                  m = new Date(dt.end).getMinutes();
                  dt.end = `${h < 10 ? '0' + h : h}:${m < 10 ? '0' + m : m}`;
                }
              })
            }
          })
        }
      }
    ).catch(err => this.toastyService.error({ title: 'Error', msg: err }));
  }


  saveDevice(device?: Device) {
    const dialogRef = this.dialog.open(DeviceDialogComponent, {
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

  sync(device?: Device) {
    const dialogRef = this.dialog.open(SyncDialogComponent);

    dialogRef.afterClosed().subscribe((response?: Date) => {
      if (!response) {
        return;
      }

      const data: any = {
        date: response
      };

      if (device) {
        data.device = {
          id: device.id
        }
      }

      this.amsDeviceService.devices.simplePost(data, 'lastSyncTime')

      this.toastyService.info({ title: 'Info', msg: 'Last Sync time has been set' })
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


  getActivationKey() {

    alert('Disabled')

    // TOOD: this is broken

    // this.isDownloading = true;
    // this.orgService.organizations.get('my').then(
    //   data => {
    //     const dialogRef = this.dialog.open(CopyContentComponent, {
    //       width: '40%',
    //       data: data.activationKey,
    //     });
    //     // this.activationKey = data.activationKey;
    //     this.isDownloading = false;
    //   }
    // ).catch(err => { this.isDownloading = false; this.toastyService.error({ title: 'Error', msg: err }) });
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

  fileUploader(file) {
    console.log(file)
    this.deviceId = file.id;
    console.log(this.deviceId)
    const access_Token: string = this.store.getItem('ams_token');
    const orgCode = this.store.getItem('orgCode');

    this.isUpload = !this.isUpload;
    this.uploader = new FileUploader({
      url: `/ams/api/devices/${this.deviceId}/logs`,
      itemAlias: 'file',
      headers: [{
        name: 'x-access-token',
        value: access_Token
      }, {
        name: 'org-code',
        value: orgCode
      }]
    });
    this.uploader.clearQueue();

    this.uploader.onErrorItem = (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
      console.log('onErrorItem', response, headers);
      this.isDownloading = false;
    };

    this.uploader.onCompleteItem = (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
      const res: any = JSON.parse(response);
      this.isDownloading = false;
      this.isUpload = false;


      if (!res.isSuccess)
        return this.toastyService.error({ title: 'Error', msg: res.error })

      return this.toastyService.success('file uploaded successfully')

    };
  }

  upload(item) {
    item.upload();
    this.isUpload = !this.isUpload;
    this.isDownloading = true;
  }

}
