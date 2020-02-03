
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs//operators';

import { ICurrentUser, CurrentUserService } from '@partie/core/services/current-user.service';
import { FriendshipService } from '@partie/shared/services/friendship.service';
import { AccountService } from '@partie/account/services/account.service';
import { DialogService } from '@partie/shared/services/dialog/dialog.service';

import { MutedUser, MutedUsersResponse } from '@partie/profile/models/followers.model';
import { Friend, FriendListChildComponentsEnum } from '@partie/shared/models/friends-list/friend.model';
import { DirectMessagingStatus, ToggleDirectMessaging } from '@partie/direct-messaging/models/direct-message.model';
import { UserSettings } from '@partie/account/models/user-settings.models';

//Constants
import { FriendTypeConstants } from '@partie/core/constants/FriendType.constants';

@Component({
  selector: 'partie-privacy-and-safety',
  templateUrl: './privacy-and-safety.component.html',
  styleUrls: ['./privacy-and-safety.component.css']
})
export class PrivacyAndSafetyComponent implements OnInit, OnDestroy {

  mutedUsers: MutedUser[];
  directMessagingAllowed: boolean;
  followerRequireApproval: boolean;
  contentAgeScreened: boolean;
  publicPosts: boolean;

  showPostVisibilityPopup: boolean;

  //Private fields
  private teardown$ = new Subject<void>();

  constructor(private readonly friendshipService: FriendshipService,
    private readonly accountService: AccountService,
    private readonly currentUserService: CurrentUserService,
    private readonly dialogService: DialogService) { }

  ngOnInit() {
    this.currentUserService.afterCurrentUserChanged
      .pipe(takeUntil(this.teardown$)).subscribe((resp: ICurrentUser) => {

        this.bindMutedUsers(resp.id);
        this.getUserSettingsFromFeedComponent();
      });
  }


  private bindMutedUsers(userId: string): void {
    this.friendshipService.getMutedUsers(userId)
      .pipe(takeUntil(this.teardown$)).subscribe((resp: MutedUsersResponse) => {
        this.mutedUsers = resp.mutedUsers as MutedUser[];
      });

    this.friendshipService.getDirectMessagingStatus(userId)
      .pipe(takeUntil(this.teardown$))
      .subscribe((resp: DirectMessagingStatus[]) => {
        this.directMessagingAllowed = resp.length > 0 ? resp[0].directMessagingAllowed : false;
      });
  }

  showMutedUsers(): void {
    if (this.mutedUsers && this.mutedUsers.length > 0) {

      const friends = this.mutedUsers.map((f: MutedUser) => {
        const friend = new Friend();
        friend.displayName = f.displayName;
        friend.friendTypeCount = f.totalFollowers;
        friend.type = FriendTypeConstants.follower;
        return friend;
      });
      const childComponent = FriendListChildComponentsEnum.RemoveUserComponent;
      const dlg = this.dialogService.openFriendsList('Muted Users', friends, childComponent);

      dlg.afterClosed.pipe(takeUntil(this.teardown$)).subscribe((gp: string) => {
        console.log(gp);
      });
    }
  }

  toggleDirectMessaging(): void {
    this.friendshipService.toggleDirectMessagingStatus()
      .pipe(takeUntil(this.teardown$))
      .subscribe((resp: ToggleDirectMessaging) => {
        this.directMessagingAllowed = resp.disabled;
      });
  }

  toggleFollowerRequireApproval(): void {
    this.followerRequireApproval = !this.followerRequireApproval;
    this.saveUserSettingsInFeedComponent();
  }
  toggleContentAgeScreened(): void {
    this.contentAgeScreened = !this.contentAgeScreened;
    this.followerRequireApproval = this.contentAgeScreened ? true : this.followerRequireApproval;
    this.saveUserSettingsInFeedComponent();
  }

  togglePostVisibility(value: boolean) {
    this.publicPosts = value;
    this.saveUserSettingsInFeedComponent();
  }

  saveUserSettingsInFeedComponent(): void {

    const settings = new UserSettings();

    settings.followerRequireApproval = this.followerRequireApproval;
    settings.contentAgeScreened = this.contentAgeScreened;
    settings.publicPosts = this.publicPosts;

    this.accountService.updateUserSettingsInFeedComponent(settings)
      .pipe(takeUntil(this.teardown$))
      .subscribe((resp: UserSettings) => {
        this.contentAgeScreened = resp.contentAgeScreened;
        this.followerRequireApproval = resp.followerRequireApproval;
        this.publicPosts = resp.publicPosts;
      });
  }

  getUserSettingsFromFeedComponent(): void {
      this.accountService.getUserSettingFromFeedComponent(null)
      .pipe(takeUntil(this.teardown$))
      .subscribe((resp: UserSettings) => {
        this.contentAgeScreened = resp.contentAgeScreened;
        this.followerRequireApproval = resp.followerRequireApproval;
        this.publicPosts = resp.publicPosts;
      });
  }

  ngOnDestroy(): void {
    this.teardown$.next();
    this.teardown$.complete();
  }


  openPostVisibilityPopup() {
    this.showPostVisibilityPopup = true;
  }

  closePostVisibilityPopup() {
    this.showPostVisibilityPopup = false;
  }
}
