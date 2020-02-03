import { Injectable } from '@angular/core';
import { Router, CanActivate} from '@angular/router';
import { CurrentUserService, ICurrentUser } from '@partie/core/services/current-user.service';
import {  Observable, Subject, of } from 'rxjs';
import { takeUntil, map, catchError } from 'rxjs/operators';
import {  OnInit } from '@angular/core';

import { SubscribeStatusEnum } from '@partie/modules/subscription/Models/Subscription.model';


@Injectable({
  providedIn: 'root'
})
export class SubscriptionGuard implements CanActivate {
  
  private teardown$ = new Subject<void>();
  private subscriptionStatus: string;
  currentUser: ICurrentUser;
  
  constructor(
    private readonly router: Router,
    private readonly currentUserService: CurrentUserService
  )
  {}

  canActivate() {

    return this.currentUserService.afterCurrentUserChanged
      .pipe(map((u: ICurrentUser) => {

        if (u.isSubscribedOnce || u.isFullMember) {
          return true;
        }
        else {
          this.router.navigateByUrl('/subscription');
          return false;
        }
      }),
        catchError((err) => {
          this.router.navigate(['/login']);
          return of(false);
        }));
  }
}
