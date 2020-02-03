import { ReplaySubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageBus {

  stop(result?: any) {
    this._afterStop.next(result);
  }

  private readonly _afterStop = new ReplaySubject<any>();
  afterStop = this._afterStop.asObservable();

  start(result?: any) {
    this._afterStart.next(result);
  }

  private readonly _afterStart= new ReplaySubject<any>();
  afterStart = this._afterStart.asObservable();
}
