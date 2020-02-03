import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor(@Inject(PLATFORM_ID) private readonly platformId: Object) { }



  setItem(key: string, item: any, isObject: boolean = true): any {

    if (isPlatformBrowser(this.platformId)) {

      const value = isObject ? JSON.stringify(item) : item;
      localStorage.setItem(key, value);
    }

  }


  getItem(key: string, isObject: boolean = true): any {

    if (isPlatformBrowser(this.platformId)) {
      const item = localStorage.getItem(key);

      return isObject ? JSON.parse(item) : item;
    }

    return undefined;
  }

  removeItem(key: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(key);
    }
  }


}


export class StorageKeys {

  static readonly refCode = 'ref-code';

}


