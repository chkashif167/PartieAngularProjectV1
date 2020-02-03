import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


//Modules
import { NotificationRoutingModule } from './notification-routing.module';
import { SharedModule } from 'app/shared/shared.module';
import { DirectiveModule } from '@partie/directive/directive.module'

//Components
import { EmptyNotificationComponent } from '@partie/modules/notification/components/empty-notification/empty-notification.component';
import { NotificationListComponent } from '@partie/modules/notification/components/notification-list/notification-list.component';
import { FollowRequestNotificationComponent } from './components/follow-request-notification/follow-request-notification.component';
import { DirectMessageComponent } from './components/direct-message/direct-message.component';

//modules
import { ThemeModule } from '@partie/theme/theme.module';
import { ViewDetailNotificationComponent } from './components/view-detail-notification/view-detail-notification.component';
import { PartieInvitationNotificationComponent } from './components/partie-invitation-notification/partie-invitation-notification.component';
import { NotificationManagerComponent } from './components/notification-manager/notification-manager.component';

@NgModule({
  declarations: [
    EmptyNotificationComponent,
    NotificationListComponent,
    FollowRequestNotificationComponent,
    DirectMessageComponent,
    ViewDetailNotificationComponent,
    PartieInvitationNotificationComponent,
    NotificationManagerComponent
  ],
  imports: [
    NotificationRoutingModule,
    SharedModule,
    CommonModule,
    DirectiveModule,
    ThemeModule
  ]

})
export class NotificationModule { }
