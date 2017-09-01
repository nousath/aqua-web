import { Injectable } from '@angular/core';




@Injectable()
export class ValidatorService {

  textLength: number = 100;
  passwordMinLength: number = 6;
  passwordMaxLength: number = 12;
  portNumberLength: number = 6;
  pinCodeLength: number = 6;
  leaveLength: number = 2;
  aletrNumberLength: number = 2;
  phoneNumberLength: number = 10;
  // passwordRegExp_onlyNumberAndChar = /^[0-9a-zA-Z]+$/;
  passwordRegExp_onlyNumberAndChar = null;

  onlyNumber: RegExp = /^[0-9]*$/;
  onlyBssid: RegExp = /^(([A-Fa-f0-9]{2}[:]){5}[A-Fa-f0-9]{2}[,]?)+$/;
  onlyNumberWithTwoDeicmal: RegExp = /^[0-9]+(\.[0-9]{1,2})?$/;
  maximunValueForLeaveBalace: number = 20;

  ipAddressPattern: RegExp = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

  ValidateIPaddress(ipAddress): boolean {
    let ipformat: RegExp = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipformat.test(ipAddress);
  }

  emailPattern: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


  validateEmail(email): boolean {
    return this.emailPattern.test(email);
  }

  constructor() { }

}
