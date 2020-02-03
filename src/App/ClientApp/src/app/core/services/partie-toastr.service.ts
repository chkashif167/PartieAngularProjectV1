import { Injectable } from '@angular/core';
import { of,Observable } from 'rxjs';
import { delay } from 'rxjs//operators';

import { ToastrService,ToastrConfig } from 'ngx-toastr';


@Injectable({
  providedIn: 'root'
})
export class PartieToastrService {

  options: ToastrConfig;
  private lastInserted: number[] = [];
  private nullObservable = of(null);

  constructor(private readonly toastr: ToastrService) {

    this.options = this.toastr.toastrConfig;

    this.options.positionClass = 'toast-top-right';
    this.options.enableHtml = false;
    this.options.tapToDismiss = true;
    this.options.closeButton = true;
    this.options.progressBar = false;
    this.options.timeOut = 4000;

    toastr.toastrConfig.maxOpened = 5;
    toastr.toastrConfig.extendedTimeOut = 1000;
    toastr.toastrConfig.autoDismiss = true;
  }

  success(message: string, title: string = '') {
    return this.openToast(message, 'success', title);
  }

  info(message: string, title: string = '') {

    return this.openToast(message, 'info', title);
  }
  warning(message: string, title: string = '') {

    return this.openToast(message, 'warning', title);
  }

  error(message: string, title: string = '') {
    return this.openToast(message, 'error', title);
  }

  clearToasts() {
    this.toastr.clear();
  }

  clearLastToast() {
    this.toastr.clear(this.lastInserted.pop());
  }

  private openToast(message: string, type: string, title: string = '') {

    this.nullObservable.pipe(delay(0)).subscribe(() => {

      const opt = JSON.parse(JSON.stringify(this.options));
      const inserted = this.toastr[type](message, title, opt);
      if (inserted) {
        this.lastInserted.push(inserted.toastId);
      }
    });
  }
}
