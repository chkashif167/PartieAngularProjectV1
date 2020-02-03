
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

//Modules
import { DirectiveModule } from '@partie/modules/directive/directive.module';
import { VendorModule } from '@partie/vendor/vendor.module'

//services
import { BanUsersService } from '@partie/shared/services/ban-users.service'


//Components
import { DialogComponent } from '@partie/shared/components/dialog/dialog.component';
import { MultiSelectListComponent } from '@partie/shared/components/multi-select-list/multi-select-list.component';
import { MultiSelectListItemComponent } from '@partie/shared/components/multi-select-list/multi-select-list-item.component';
import { FriendsListComponent } from '@partie/shared/components/friends-list/friends-list.component';
import { JoinRoomComponent } from '@partie/shared/components/room/join-room.component';
import { BadgeStatsComponent } from '@partie/shared/components/badge-stats/badge-stats.component';
import { FollowUnfollowUserComponent } from '@partie/shared/components/friends-list/follow-unfollow-user/follow-unfollow-user.component';
import { MessageFriendComponent } from '@partie/shared/components/friends-list/message-friend/message-friend.component';
import { JoinRoomRequestListComponent } from '@partie/shared/components/room/join-room-request-list/join-room-request-list.component';
import { InviteToRoomComponent } from '@partie/shared/components/room/invite-to-room/invite-to-room.component';
import { ActionConfirmationComponent } from '@partie/shared/components/action-confirmation/action-confirmation.component';
import { NotificationLinkComponent } from '@partie/shared/components/notification/notification-link/notification-link.component';
import { TermsandconditionsComponent } from '@partie/shared/components/termsandconditions/termsandconditions.component';
import { SocialMediaButtonsComponent } from '@partie/shared/components/social-media/social-media-buttons.component';


import { RemoveRoomUserButtonComponent } from '@partie/shared/components/friends-list/remove-room-user/remove-room-user-button/remove-room-user-button.component';
import { RemoveRoomUserDialogComponent } from '@partie/shared/components/friends-list/remove-room-user/remove-room-user-dialog/remove-room-user-dialog.component';
import { SocialMediaDialogComponent } from '@partie/shared/components/social-media/social-media-dialog.component';
import { ReportDialogComponent } from './components/report-dialog/report-dialog.component';
import { EqualValidator } from './validators/equal.validator';
import { GamePlatformMapService } from './services/game-platform-map/game-platform-map.service';




@NgModule({
    declarations: [
        MultiSelectListComponent,
        MultiSelectListItemComponent,
        DialogComponent,
        FriendsListComponent,
        JoinRoomComponent,
        BadgeStatsComponent,
        FollowUnfollowUserComponent,
        MessageFriendComponent,
        JoinRoomRequestListComponent,
        InviteToRoomComponent,
        ActionConfirmationComponent,
        NotificationLinkComponent,
        TermsandconditionsComponent,
        RemoveRoomUserButtonComponent,
        RemoveRoomUserDialogComponent,
        SocialMediaButtonsComponent,
        SocialMediaDialogComponent,
        ReportDialogComponent,
        EqualValidator

    ],
    imports: [
        FormsModule,
        CommonModule,
        DirectiveModule,
        RouterModule,
        VendorModule

    ],
    exports: [
        NotificationLinkComponent,
        TermsandconditionsComponent,
        ActionConfirmationComponent,
        SocialMediaDialogComponent,
        SocialMediaButtonsComponent,
        ReportDialogComponent,
        EqualValidator

    ],
    entryComponents: [
        DialogComponent,
        MultiSelectListComponent,
        MultiSelectListItemComponent,
        FriendsListComponent,
        JoinRoomComponent,
        BadgeStatsComponent,
        FollowUnfollowUserComponent,
        JoinRoomRequestListComponent,
        InviteToRoomComponent,
        ActionConfirmationComponent,
        SocialMediaButtonsComponent,
        SocialMediaDialogComponent,
        ReportDialogComponent
    ],
    providers:
        [
            BanUsersService,
            GamePlatformMapService
        ]
})
export class SharedModule { }
