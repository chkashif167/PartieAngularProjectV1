import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscribeComponent } from './components/subscribe/subscribe.component';


//Modules
import { SubscriptionRoutingModule } from '@partie/modules/subscription/subscription-routing.module';

@NgModule({
  declarations: [SubscribeComponent],
  imports: [
    CommonModule,
    SubscriptionRoutingModule
  ]
})
export class SubscriptionModule { }
