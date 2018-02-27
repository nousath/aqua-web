import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageService {

  constructor() { }

  getItem(key: string): any {
    return window.localStorage.getItem(key);
  }

  setItem(key: string, value: string): void {
    window.localStorage.setItem(key, value);
  }

  removeItem(key: string): void {
    window.localStorage.removeItem(key);
  }

  clear(): void {
    return window.localStorage.clear();
  }

  getObject(key): any {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }

  setObject(key: string, value: any): any {
    window.localStorage.setItem(key, JSON.stringify(value));
    return value;
  }

}
