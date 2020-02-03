import { Injectable } from '@angular/core';
import { pipe, Observable, ReplaySubject } from 'rxjs';

//Services
import { ApiBaseService } from '@partie/shared/services/api-base.service';

import { SubscribeStatusEnum,SubscriptionResponse } from '@partie/modules/subscription/Models/Subscription.model';


@Injectable({
  providedIn: 'root'
})
export class SubscriptionService extends ApiBaseService {

  private subscribe: ReplaySubject<SubscriptionResponse> = new ReplaySubject<SubscriptionResponse>(   );
  subscribe$: Observable<SubscriptionResponse> = this.subscribe.asObservable();

  private subscriptionStatus: ReplaySubject<SubscribeStatusEnum> = new ReplaySubject<SubscribeStatusEnum>(1);
  subscriptionStatus$: Observable<SubscribeStatusEnum> = this.subscriptionStatus.asObservable();


  private getSubscription(): void {

    this.post(null, '/Subscription/subscribe', false)
      .subscribe((resp: SubscriptionResponse) => {
        this.subscribe.next(resp);
      });
  }

  checkUserSubscriptionStatus(): void {

    this.post(null, '/Subscription/checkUserSubscriptionStatus', false)
      .subscribe((resp: SubscribeStatusEnum) => {
        this.subscriptionStatus.next(resp);
      });
   
  }
    
  startSubscriptionProcess() : void{
    this.getSubscription();
  }

  

}
