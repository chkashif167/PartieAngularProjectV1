import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { AccountGuard } from '@partie/core/guards/account.guard';
import { SubscriptionGuard } from '@partie/core/guards/subscription.guard';

const routes: Routes = [

  { path: '', loadChildren: './modules/startup/startup.module#StartupModule' }, //landing page
  { path: 'register', loadChildren: './modules/register/register.module#RegisterModule' }, //registration
  { path: 'auth-callback', loadChildren: './modules/auth/auth.module#AuthModule' }, //callback from auth server
  { path: 'verify', loadChildren: './modules/verify/verify.module#VerifyModule' },
  //{ path: 'dashboard', loadChildren: './modules/dashboard/dashboard.module#DashboardModule', canActivate: [AccountGuard] },
  { path: 'account', loadChildren: './modules/account/account.module#AccountModule', canActivate: [AccountGuard, SubscriptionGuard] },
  { path: 'profile', loadChildren: './modules/profile/profile.module#ProfileModule', canActivate: [AccountGuard, SubscriptionGuard] },
  { path: 'partie', loadChildren: './modules/room/room.module#RoomModule', canActivate: [AccountGuard, SubscriptionGuard] },
  { path: 'messages', loadChildren: './modules/direct-messaging/direct-messaging.module#DirectMessagingModule', canActivate: [AccountGuard, SubscriptionGuard] },
  { path: 'feed', loadChildren: './modules/feeds/feeds.module#FeedsModule', canActivate: [AccountGuard, SubscriptionGuard ] },
  { path: 'notifications', loadChildren: './modules/notification/notification.module#NotificationModule', canActivate: [AccountGuard, SubscriptionGuard] },
  { path: 'subscription', loadChildren: './modules/subscription/subscription.module#SubscriptionModule', canActivate: [AccountGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
