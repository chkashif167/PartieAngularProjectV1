import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';



import { RouteUtilityService } from '@partie/shared/services/route-utility.service';

@Component({
  selector: 'partie-invitation-notification',
  template: `<div class="btn-group request-actions">
  <button class="btn btn-bare" (click)="deny()"><img src="/assets/images/icons/32px/remove.svg" class="remove-icon" alt="Remove Icon" ></button>
  <button class="btn btn-bare" (click)="accept()"><img src="/assets/images/icons/32px/check.svg" alt="Check Icon" ></button>
</div>
`
 
})
export class PartieInvitationNotificationComponent implements OnInit {

  @Input()url:string;
  @Output('onRead') markRead: EventEmitter<null>;


  constructor(private readonly routeService: RouteUtilityService) {
    this.markRead = new EventEmitter();
  }

  ngOnInit() {
  }


  deny() {
    this.markRead.emit();
  }

  accept() {
    this.markRead.emit();
    this.routeService.navigateToUrl(this.url);
  }



}
