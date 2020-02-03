
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { SubscribeStatusEnum, SubscriptionResponse } from '@partie/modules/subscription/Models/Subscription.model';

import { SubscriptionService } from '@partie/modules/subscription/services/subscription.service';
import { CurrentUserService, ICurrentUser } from '@partie/core/services/current-user.service';

import { WindowWrapperService } from '@partie/core/services/window-wrapper.service';
import { AuthService } from '@partie/core/services/auth.service';
import { UtilityService } from '@partie/core/services/utility.service';

@Component({
  selector: 'partie-subscribe',
  templateUrl: './subscribe.component.html'
})
export class SubscribeComponent implements OnInit {

  paymentUrl: string;
  paymentButton: string;
  private teardown$ = new Subject<void>();
  public userNotSubscribed: boolean;
  private status = SubscribeStatusEnum;
 
 
  constructor(public subscriptionService: SubscriptionService,
    private windowService: WindowWrapperService,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly currentUserService: CurrentUserService,
    private readonly utilityService: UtilityService) {
    this.paymentButton = 'Subscribe';
  }

  ngOnInit() {
    
    this.subscriptionService.checkUserSubscriptionStatus();
    this.subscriptionService.subscriptionStatus$.subscribe((status:any) => {

        if (this.utilityService.isUserSubscribedOnce(status.subscriptionStatus)) {
          this.currentUserService.setSubscriptionStatus(status);
          this.router.navigateByUrl(`/`);
      }}
    );
  }

  submit(): void {

    this.subscriptionService.startSubscriptionProcess();

    this.subscriptionService.subscribe$
      .pipe(takeUntil(this.teardown$))
      .subscribe((subscribe: SubscriptionResponse) => {
        this.paymentUrl += "";
        this.paymentUrl = subscribe.approvalLink;

        if (subscribe.status === SubscribeStatusEnum.FAILED) {
          this.paymentButton = subscribe.status.toString();

        } else {
          this.windowService.nativeWindow.location.href = this.paymentUrl;
        }
      });
  }

  logout(): void {
    this.authService.logout();
  }
}
