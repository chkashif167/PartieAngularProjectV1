import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Notification,  } from '@partie/notification/models/notification.model';

@Component({
  selector: 'partie-view-detail-notification',
  template: `<a  [routerLink]="[redirectToUrl]" [queryParams]="queryParams" (click)="onRead.emit()" class="btn bg-black">View</a>`,
 
})
export class ViewDetailNotificationComponent implements OnInit {

  @Input('url')
  redirectToUrl: string;

  @Input() queryParams:any;

  @Output() onRead: EventEmitter<null>;

  constructor() {
    this.onRead = new EventEmitter();
  }

  ngOnInit() {
  }

}
