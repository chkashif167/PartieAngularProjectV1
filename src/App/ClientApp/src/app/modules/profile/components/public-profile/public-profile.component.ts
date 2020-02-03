import { Component, OnInit, ViewChild, OnDestroy, Renderer2 } from '@angular/core';
import { Location } from '@angular/common';
import { Subject, from } from 'rxjs';
import { takeUntil } from 'rxjs//operators';
import { ActivatedRoute, Router } from '@angular/router';

//Components


//Models
import { Profile } from '@partie/profile/models/profile.model';
import { FriendshipCounters, FollowUserResponse } from '@partie/profile/models/fiendship.model';
import { Follower, Following, MutedUser, MutedUsersResponse } from '@partie/profile/models/followers.model';
import { Friend, FriendListChildComponentsEnum } from '@partie/shared/models/friends-list/friend.model';
import { UserBadge, BadgeStats } from '@partie/room/models/rate-host/rate-host.model';
import { ContextMenu } from '@partie/theme/models/context-menu.model';
import { ReportUser } from '@partie/modules/profile/models/report-user.model';
import { UserSettings } from '@partie/modules/account/models/user-settings.models';
import { UserRoomInformation } from '@partie/modules/room/models/room.model';

//Services
import { RoomService } from '@partie/modules/room/services/room.service';
import { FriendshipService } from '@partie/shared/services/friendship.service';
import { PartieToastrService } from '@partie/core/services/partie-toastr.service';
import { CurrentUserService, ICurrentUser } from '@partie/core/services/current-user.service';
import { DialogService } from '@partie/shared/services/dialog/dialog.service';
import { BadgeService } from '@partie/shared/services/badge/badge.service';
import { AuthService } from '@partie/core/services/auth.service';
import { AccountService } from '@partie/modules/account/services/account.service';
import { ProfileService } from '@partie/modules/profile/services/profile.service';
import { UiUpdatesManagerService } from '@partie/core/services/ui-updates-manager.service';


//Constants
import { FriendTypeConstants } from '@partie/core/constants/FriendType.constants';

//Components
import { ReportDialogComponent } from '@partie/shared/components/report-dialog/report-dialog.component';



@Component({
    selector: 'partie-public-profile',
    templateUrl: './public-profile.component.html',
    styleUrls: ['./public-profile.component.css']
})
export class PublicProfileComponent implements OnInit, OnDestroy {

    //Private fields


    profile: Profile;
    friendshipCounters: FriendshipCounters;
    followers: Follower[];
    followings: Following[];
    mutedUsers: MutedUser[];
    currentUser: ICurrentUser;
    userId: string;
    badgeStats: BadgeStats;
    contextMenu: ContextMenu[];

    showFollowrers: boolean;
    showMessageButton = false;
    partieListCount: number;
    totalBadges: number;
    modelReportedUser: ReportUser;
    partieList: UserRoomInformation[];
    website: string;



    private teardown$ = new Subject<void>();
    followerRequireApproval: boolean;
    userLevel: number;

    //Ctor
    constructor(private readonly profileService: ProfileService,
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly location: Location,
        private readonly friendshipService: FriendshipService,
        private readonly currentUserService: CurrentUserService,
        private readonly dialogService: DialogService,
        private readonly renderer: Renderer2,
        private readonly badgeService: BadgeService,
        private readonly partieToastService: PartieToastrService,
        private readonly authService: AuthService,
        private readonly roomService: RoomService,
        private readonly uiUpdateManager: UiUpdatesManagerService
    ) {

        //replace bg-dark by bg-black
        this.renderer.removeClass(document.body, 'bg-dark');
        this.renderer.addClass(document.body, 'bg-black');

        this.badgeStats = new BadgeStats();
        this.contextMenu = new Array<ContextMenu>();

    }

    ngOnInit() {
      this.subscribeToServerPushChanges();
      this.route.params.subscribe(p => {
        this.userId = p.id;

        if (this.userId == undefined) {

          this.currentUserService.afterCurrentUserChanged
            .pipe(takeUntil(this.teardown$))
            .subscribe((u: ICurrentUser) => {
              this.userId = u.id;
              console.log(this.location);
              this.location.replaceState(`/profile/${u.id}`);
              this.loadData();

            });

        } else {

          this.loadData();
        }

      });
    }

    private loadData(): void {
        this.bindProfile();
        this.bindBadgeStats();
        this.getPartieList();
        this.getUserLevel();
    }

    private bindProfile(): void {
       
        this.profileService.getProfile(this.userId)
            .pipe(takeUntil(this.teardown$))
            .subscribe((profile: Profile) => {
                this.profile = profile;

                if (this.profile.biography != null) {
                    this.profile.biography = this.profile.biography.replace(/(?:\r\n|\r|\n)/g, '<br/>');
                }
                if (this.profile.externalLink != null && !this.profile.externalLink.startsWith("http")) {
                    this.website = "http://" + this.profile.externalLink;
                }
                else {
                    this.website = this.profile.externalLink;
                }
                this.changeSelfProfileStatus();
                this.bindFriendshipCounters();
                this.bindFollowers();
                this.bindFollowings();
                this.buildContextMenu();
            });
    }

    private bindFriendshipCounters(): void {

        this.friendshipService.getCounters(this.userId)
            .pipe(takeUntil(this.teardown$)).subscribe(resp => {
                this.friendshipCounters = resp as FriendshipCounters;

            });
    }

    private bindFollowers(): void {

        this.friendshipService.getFollowers(this.userId)
            .pipe(takeUntil(this.teardown$)).subscribe(followersResp => {
                this.followers = followersResp.followers as Follower[];

                this.currentUserService.afterCurrentUserChanged
                    .pipe(takeUntil(this.teardown$)).subscribe(resp => {
                        var alreadyFollowing = this.followers.filter(f => f.followerUserId === resp.id)[0];
                        this.profile.currentUserIsFollowing = alreadyFollowing != null;
                        this.buildContextMenu();
                    });
            });
    }

    private bindFollowings(): void {

        this.friendshipService.getFollowings(this.userId)
            .pipe(takeUntil(this.teardown$)).subscribe(resp => {
                this.followings = resp.followings as Following[];
                this.showFollowrers = true;
                this.bindIfCurrentUserIsFollower();
            });
    }

    private bindIfCurrentUserIsFollower(): void {
        this.currentUserService.afterCurrentUserChanged
            .pipe(takeUntil(this.teardown$)).subscribe(resp => {

                if (this.currentUser.id === this.userId) {
                    this.showMessageButton = false;
                    return;
                }
                this.showMessageButton = this.followings.filter(x => x.followingUserId === this.currentUser.id)[0] !== undefined;

            });

    }

    private changeSelfProfileStatus(): void {

        this.currentUserService.afterCurrentUserChanged
            .pipe(takeUntil(this.teardown$)).subscribe(resp => {

                this.currentUser = resp as ICurrentUser;
                this.profile.self = this.userId === this.currentUser.id;

                this.bindMutedUsers();
            });
    }

    private bindMutedUsers(): void {

        this.friendshipService.getMutedUsers(this.currentUser.id)
            .pipe(takeUntil(this.teardown$))
            .subscribe((resp: MutedUsersResponse) => {

                this.mutedUsers = resp.mutedUsers;

                this.profile.muted = this.friendshipService.userMuted(this.userId, this.mutedUsers);
                this.buildContextMenu();
            });
    }

    follow(): void {

        this.friendshipService.followUser(this.userId)
            .pipe(takeUntil(this.teardown$)).subscribe((resp: FollowUserResponse) => {
                this.profile.currentUserIsFollowing = true;
                this.bindFollowers();
                this.bindFollowings();
                this.bindFriendshipCounters();
                if (resp.userFollowed) {
                    this.partieToastService.success(`User successfully followed`);
                }
                if (resp.approvalRequired) {
                this.partieToastService.success(`Follow request has sent successfully`);
                }
                if (resp.approvalPending) {
                    this.partieToastService.info(`Follow request pending.`);
                }
            });

    }

    unFollow(): void {

        this.friendshipService.unFollowUser(this.userId)
            .pipe(takeUntil(this.teardown$)).subscribe(resp => {
                this.profile.currentUserIsFollowing = false;
                this.bindFollowers();
                this.bindFollowings();
                this.bindFriendshipCounters();
                this.partieToastService.success(`User successfully un-followed`);
            });
    }

    ngOnDestroy(): void {
        this.teardown$.next();
        this.teardown$.complete();

        //replace bg-black by bg-dark
        this.renderer.removeClass(document.body, 'bg-black');
        this.renderer.addClass(document.body, 'bg-dark');
    }



    onMute(): void {

        this.friendshipService.muteUser(this.userId)
            .pipe(takeUntil(this.teardown$)).subscribe(resp => {

                this.bindMutedUsers();
                this.partieToastService.success(`User successfully muted`);
            });
    }

    onUnMute(): void {

        this.friendshipService.unMuteUser(this.userId)
            .pipe(takeUntil(this.teardown$)).subscribe(resp => {

                this.bindMutedUsers();
                this.partieToastService.success(`User successfully unmuted`);
            });
    }

    onReport() {

        this.modelReportedUser = new ReportUser();
        this.modelReportedUser.reportedUserId = this.userId;
        const dlg = this.dialogService.openDialog('Report this account for abuse', ReportDialogComponent, 'model', this.modelReportedUser);

        dlg.afterClosed.pipe(takeUntil(this.teardown$))
          .subscribe((reportUser: ReportUser) => {

            if (!reportUser.comments || !reportUser.comments.trim()) return;
                this.modelReportedUser = reportUser;
                this.profileService.reportUser(this.modelReportedUser)
                    .pipe(takeUntil(this.teardown$)).subscribe(resp => {
                        this.partieToastService.success(`User successfully reported`);
                    });
            });
    }

    onEdit() {

        this.router.navigateByUrl('/profile/edit');
    }


    showParties() {

        this.getPartieList();
        const dlg = this.dialogService.openPatriesDialog('Parties List', this.partieList);
        dlg.afterClosed.pipe(takeUntil(this.teardown$)).subscribe((gp: string) => console.log(gp));
    }

    showFollowers(): void {

        const friends = this.convertFollowersToFriends();
        if (friends.length > 0) {

            const childComponent = FriendListChildComponentsEnum.FollowUnfollowUserComponent;
            const dlg = this.dialogService.openFriendsList('Followers', friends, childComponent);
            dlg.afterClosed.pipe(takeUntil(this.teardown$)).subscribe((gp: string) => console.log(gp));
        }
    }



    private convertFollowersToFriends(): Friend[] {

        if (this.followers && this.followers.length > 0) {

            return this.followers.map((f: Follower) => {
                const friend = new Friend();
                friend.id = f.followerUserId;
                friend.displayName = f.displayName;
                friend.friendTypeCount = f.totalFollowers;
                friend.type = FriendTypeConstants.follower;
        		friend.tag = f.userTag;
                return friend;
            });
        }
        return [];
    }

    showFollowings(): void {

        const friends = this.convertFollowingsToFriends();
        if (friends.length > 0) {
            const childComponent = FriendListChildComponentsEnum.FollowUnfollowUserComponent;
            const dlg = this.dialogService.openFriendsList('Followings',
                friends,
                childComponent);
            dlg.afterClosed.pipe(takeUntil(this.teardown$)).subscribe((gp: string) => console.log(gp));
        }
    }

    private convertFollowingsToFriends(): Friend[] {

        if (this.followings && this.followings.length > 0) {

            return this.followings.map((f: Following) => {
                const friend = new Friend();
                friend.id = f.followingUserId;
                friend.displayName = f.displayName;
                friend.friendTypeCount = f.totalFollowers;
                friend.type = FriendTypeConstants.follower;
        		friend.tag = f.userTag;
                return friend;
            });
        }
        return [];
    }

    showBadges(): void {

        this.dialogService.openBadgeStatsDialog('Badges', this.badgeStats);
    }

    private bindBadgeStats(): void {
        this.badgeService.getUserBadgeStats(this.userId)
            .pipe(takeUntil(this.teardown$))
            .subscribe((resp: UserBadge[]) => {

                this.badgeStats.complimentBadges = resp.filter(x => x.isComplimentToken);
                this.badgeStats.achievementBadges = resp.filter(x => !x.isComplimentToken);
                this.setBadgeCount();
            });
    }

    setBadgeCount(): void {

        this.totalBadges = this.badgeStats
            ? this.badgeStats.complimentBadges.map(x => x.total).reduce((p, c) => p + c) + this.badgeStats.achievementBadges.filter(x => x.hasWon).length
            : 0;

    }

    buildContextMenu(): void {
        this.contextMenu = new Array<ContextMenu>();
        let item: ContextMenu;

        if (this.profile.self) {
            item = { id: 1, title: "Edit", description: "Edit your profile", iconUrl: "" } as ContextMenu;
            this.contextMenu.push(item);
            item = { id: 2, title: "Change Password", description: "Change your password", iconUrl: "" } as ContextMenu;
            this.contextMenu.push(item);
        } else {

            if (this.profile.currentUserIsFollowing) {

                if (this.profile.muted) {
                    item = { id: 4, title: "Unmute", description: "Start seeing posts", iconUrl: "/assets/images/icons/32px/message.svg" } as ContextMenu;
                    this.contextMenu.push(item);
                } else {
                    item = { id: 3, title: "Mute", description: "Stop seeing posts but continue following", iconUrl: "/assets/images/icons/32px/mute.svg" } as ContextMenu;
                    this.contextMenu.push(item);
                }

                item = { id: 5, title: "Unfollow", description: "Stop seeing posts and unfollow", iconUrl: "/assets/images/icons/32px/remove.svg" } as ContextMenu;
                this.contextMenu.push(item);
            }

            item = { id: 6, title: "Report", description: "Report this account for abuse", iconUrl: "/assets/images/icons/32px/report.svg" } as ContextMenu;
            this.contextMenu.push(item);
        }

        item = { id: 7, title: "Logout", description: "Logout from application", iconUrl: "" } as ContextMenu;
        this.contextMenu.push(item);

    }

    contextMenuClicked(item: ContextMenu): void {
        switch (item.id) {
            case 1: this.onEdit(); break;
            case 2: this.onChangePassword(); break;
            case 3: this.onMute(); break;
            case 4: this.onUnMute(); break;
            case 5: this.unFollow(); break;
            case 6: this.onReport(); break;
            case 7: this.authService.logout(); break;

        }
    }

    getPartieList() {
        this.roomService.getUserRoomsInformation(this.userId)
            .pipe(takeUntil(this.teardown$))
            .subscribe((result: UserRoomInformation[]) => {
                this.partieList = result;
                this.partieListCount = this.partieList.length;
            });
    }

    hasRole(role: string): boolean {
        return this.currentUserService.hasRole(role);
    }
   
    private subscribeToServerPushChanges(): void {
      this.uiUpdateManager.userFollowChanged
        .pipe(takeUntil(this.teardown$))
          .subscribe((pl: any) => {
              if (this.userId === pl.followedUserId) {
                  this.profile.currentUserIsFollowing = true;
              }
              this.bindFriendshipCounters();
              this.bindFollowers();
          });

        this.uiUpdateManager.userUnFollowChanged
            .pipe(takeUntil(this.teardown$))
            .subscribe((pl: any) => {
                if (this.userId === pl.unFollowedUserId) {
                  this.profile.currentUserIsFollowing = false;
                }

                this.bindFriendshipCounters();
                this.bindFollowers();
        });

    }

    getUserLevel() {
      this.roomService.getUserLevel(this.userId)
        .pipe(takeUntil(this.teardown$))
          .subscribe((result: any)=> {
          this.userLevel = result.level;
        });
    }

    onChangePassword() {
      this.router.navigateByUrl('/profile/change');
    }

   
}
