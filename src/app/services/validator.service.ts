import { Injectable } from '@angular/core';




@Injectable()
export class ValidatorService {

  textLength = 100;
  passwordMinLength = 6;
  passwordMaxLength = 12;
  portNumberLength = 6;
  pinCodeLength = 6;
  leaveLength = 2;
  aletrNumberLength = 2;
  phoneNumberLength = 10;
  // passwordRegExp_onlyNumberAndChar = /^[0-9a-zA-Z]+$/;
  passwordRegExp_onlyNumberAndChar = null;

  onlyNumber: RegExp = /^[0-9]*$/;
  onlyBssid: RegExp = /^(([A-Fa-f0-9]{2}[:]){5}[A-Fa-f0-9]{2}[,]?)+$/;
  onlyNumberWithTwoDeicmal: RegExp = /^[0-9]+(\.[0-9]{1,2})?$/;
  maximunValueForLeaveBalace = 20;

  ipAddressPattern: RegExp = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  emailPattern: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  ValidateIPaddress(ipAddress): boolean {
    const ipformat: RegExp = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipformat.test(ipAddress);
  }



  validateEmail(email): boolean {
    return this.emailPattern.test(email);
  }

  constructor() { }

}
