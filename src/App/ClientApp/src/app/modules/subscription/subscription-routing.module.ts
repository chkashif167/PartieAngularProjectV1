import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Components
import { SubscribeComponent } from '@partie/modules/subscription/components/subscribe/subscribe.component';


const routes: Routes = [
  { path: '', component: SubscribeComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubscriptionRoutingModule { }
