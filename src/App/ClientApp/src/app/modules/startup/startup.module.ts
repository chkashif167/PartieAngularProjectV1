import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { LandingComponent } from '@partie/startup/landing.component';
import { ReferralComponent } from '@partie/startup/referral.component';

import { RedirectGuard } from '@partie/core/guards/redirect.guard';

import { SharedModule } from '@partie/shared/shared.module';

export const routes = [
  { path: '', component: LandingComponent, pathMatch: 'full', canActivate: [RedirectGuard] },
  { path: 'referral/:id', component: ReferralComponent, pathMatch: 'full' }

];


@NgModule({
  declarations: [LandingComponent, ReferralComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class StartupModule { }
