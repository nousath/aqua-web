import { Component, OnInit } from '@angular/core';
// import { Page } from '../../common/contracts/page';
// import { Model } from '../../common/contracts/model';
// import { Device } from '../../models/device';
// import { AmsDeviceService } from '../../services/ams/ams-device.service';
// import { ToastyService } from 'ng2-toasty';
// import { ValidatorService } from '../../services/validator.service';
// import { PushEventService } from '../../services/push-event.service';
// import { CurrentPage } from '../../models/push-events';
// import { AmsOrganizationService } from '../../services/ams/ams-organization.service';
import { Angulartics2 } from 'angulartics2';
import { Device, CurrentPage } from '../../../../models';
import { Page } from '../../../../common/contracts/page';
import { Model } from '../../../../common/contracts/model';
import { AmsDeviceService, ValidatorService, AmsOrganizationService } from '../../../../services';
import { ToastyService } from 'ng2-toasty';
import { PushEventService } from '../../../../services/push-event.service';

@Component({
  selector: 'ams-gs-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.css']
})
export class DevicesComponent implements OnInit {

  section: 'main' | 'configure' = 'main';

  devices: Page<Device>;
  deviceTypes: Page<Device>;
  device: Model<Device>

  constructor(private amsDeviceService: AmsDeviceService,
    public validatorService: ValidatorService,
    private toastyService: ToastyService,
    private amsOrganizationService: AmsOrganizationService,
    private pushEventService: PushEventService,
    private angulartics2: Angulartics2) {

    const page: CurrentPage = new CurrentPage();
    page.header = 'Add Devices';
    page.description = 'You can add device for sync attendance';
    page.nextUrl = '/pages/wizard/syncapp';
    page.page = 'devices';
    page.onBoardingStatus = 'devices';
    pushEventService.pushPage(page);

    this.devices = new Page({
      api: amsDeviceService.devices
    });

    this.deviceTypes = new Page({
      api: amsDeviceService.deviceTypes
    });

    this.device = new Model({
      api: amsDeviceService.devices,
      properties: new Device()
    });

    this.fetchDevices();
    this.deviceTypes.fetch().catch(err => this.toastyService.error({ title: 'Error', msg: err }));


  }

  next() {
    this.amsOrganizationService.nextStep('devices', '/pages/wizard/syncapp');
    this.angulartics2.eventTrack.next({ action: 'proceedClick', properties: { category: 'wizardDevices' } });
  }

  fetchDevices() {
    this.devices.fetch().catch(err => this.toastyService.error({ title: 'Error', msg: err }));
  }

  getUrl(url: string): string {
    return url ? url : '../../../assets/images/machine.png';
  }

  switchSectrion(section: 'main' | 'configure', deviceType?: Device) {
    this.section = section;
    if (deviceType) {
      this.device.properties.category = deviceType.category;
      this.device.properties.machine = deviceType.machine;
    } else {
      this.device.properties = new Device();
    }
    this.angulartics2.eventTrack.next({ action: 'popalarDevicesClick', properties: { category: 'wizardDevices' } });
  }

  saveDevice() {
    this.device.save().then(
      result => {
        this.fetchDevices();
        this.device.properties = new Device();
        this.section = 'main';
      }
    ).catch(err => this.toastyService.error({ title: 'Error', msg: err }));
  }


  ngOnInit() {
  }

}
