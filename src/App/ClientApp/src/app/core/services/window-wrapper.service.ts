import { Injectable } from '@angular/core';

function windowObject():any {
  // return the global native browser window object
  return window;
}

@Injectable({
  providedIn: 'root'
})
export class WindowWrapperService {

  constructor() { }


  get nativeWindow(): any {
    return windowObject();
  }

}
