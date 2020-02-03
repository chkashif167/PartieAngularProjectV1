import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs//operators';

import { WindowWrapperService } from '@partie/core/services/window-wrapper.service';
import { Position } from '@partie/register/models/position.model';

@Injectable()
export class GeolocationService {

  private navigator: any;
  private location: BehaviorSubject<Position>;
 
  constructor(private readonly httpClient:HttpClient,
    private readonly winRef: WindowWrapperService) {

    
    this.navigator = winRef.nativeWindow.navigator;
    this.location = new BehaviorSubject<Position>(new Position('0', '0'));

  }

  getLocation(): Observable<Position> {

    let pos: Position;
    if (this.navigator) {
      this.navigator.geolocation.getCurrentPosition(position => {
        pos = this.displayLocationInfo(position);
        this.location.next(pos);
      });
    }

    return this.location.asObservable();
  }

  private displayLocationInfo(position: any): Position {
    return new Position(position.coords.latitude, position.coords.longitude);
    
  }

  getIpAddress(): Observable<string> {
    const url = 'https://api.ipify.org?format=json';
    return this.httpClient.get(url).pipe(map((response: any)=> response.ip as string));
  }

}
