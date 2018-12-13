import { Injectable, EventEmitter } from '@angular/core';
import { CurrentPage } from '../models/push-events';

@Injectable()
export class PushEventService {

  currentPage: EventEmitter<CurrentPage> = new EventEmitter();
  pushPage(currentPage: CurrentPage) {
    this.currentPage.emit(currentPage);
  }

  constructor() { }

}
