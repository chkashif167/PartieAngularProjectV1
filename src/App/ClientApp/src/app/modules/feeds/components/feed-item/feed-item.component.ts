
import { Component, OnInit, Input, EventEmitter, Output, ViewChild, OnDestroy } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';

//Components
import { DrawerMenuComponent } from '@partie/theme/components/drawer-menu/drawer-menu.component';
import { SocialMediaDialogComponent } from '@partie/shared/components/social-media/social-media-dialog.component';
import { Subject } from 'rxjs';

//Model
import {
    SearchUserPostResponse,
    LikeUserPostRequest,
    UnlikeUserPostRequest
} from '@partie/feeds/models/user-post.model';
import { SocialMedia } from '@partie/shared/models/social-media/social-media.model';
import { FollowUserResponse } from '@partie/modules/profile/models/fiendship.model';


import { ContextMenu } from '@partie/theme//models/context-menu.model';
import { ICurrentUser } from '@partie/core/services/current-user.service';

//Services
import { FileService } from '@partie/core/services/file.service';
import { FeedService } from '@partie/feeds/services/feed.service';
import { PartieToastrService } from '@partie/core/services/partie-toastr.service';
import { FriendshipService } from '@partie/shared/services/friendship.service';
import { DialogService } from '@partie/shared/services/dialog/dialog.service';
import { UserFeedbackComponent } from '@partie/feeds/components/user-feedback/user-feedback.component';
import { UiUpdatesManagerService } from '../../../../core/services/ui-updates-manager.service';


@Component({
    selector: 'partie-feed-item',
    templateUrl: './feed-item.component.html',
    styleUrls: ['./feed-item.component.css']
})
export class FeedItemComponent implements OnInit, OnDestroy {

    @Input() userPostItem: SearchUserPostResponse;
    @Input() currentUser: ICurrentUser;
    @Output() onRemovePost = new EventEmitter<SearchUserPostResponse>();

    postFile: string;
    model: SocialMedia;


    contextMenu: ContextMenu[];
    @ViewChild(DrawerMenuComponent) drawerMenuComponent: DrawerMenuComponent;

    private teardown$ = new Subject<void>();

    constructor(private readonly fileService: FileService,
        private readonly feedService: FeedService,
        private readonly friendshipService: FriendshipService,
        private readonly router: Router,
        private readonly toastrService: PartieToastrService,
        private readonly dialogService: DialogService,
        private readonly uiUpdateManager: UiUpdatesManagerService) {

        this.userPostItem = new SearchUserPostResponse();

    }

    ngOnInit() {

        this.postFile = this.fileService.getPostFileUrl(this.userPostItem.createdById, this.userPostItem.id, this.userPostItem.file.name);
    

    }

    ngOnDestroy(): void {
        this.teardown$.next();
        this.teardown$.complete();
    }

    showItemDetails() {

        this.buildContextMenu();
        this.drawerMenuComponent.toggleMenu(true);
    }


    toggleLikePost(): void {


        if (!this.userPostItem.liked) {

            this.likePost();
            return;
        }
        this.unLikePost();
    }



    private likePost(): void {

        const request = new LikeUserPostRequest();
        request.postId = this.userPostItem.id;
        this.feedService.likeUserPost(request);
    }

    private unLikePost(): void {

        const unlikeRequest = new UnlikeUserPostRequest();
        unlikeRequest.postId = this.userPostItem.id;
        this.feedService.unLikeUserPost(unlikeRequest);
    }

    private buildContextMenu(): void {

        this.contextMenu = [];

        if (!this.userPostItem.private) {
            const shareUserMenu = new ContextMenu();
            shareUserMenu.title = 'Share';
            shareUserMenu.description = 'Share post in social media';
            shareUserMenu.id = 1;
            shareUserMenu.iconUrl = '/assets/images/icons/misc/share-partie.svg';
            this.contextMenu.push(shareUserMenu);
        }

        if (this.isCurrentUserPost(this.currentUser.id)) {

            const muteUserMenu = new ContextMenu();
            muteUserMenu.title = 'Remove';
            muteUserMenu.description = 'Stop seeing posts but continue following';
            muteUserMenu.id = 2;
            muteUserMenu.iconUrl = '/assets/images/icons/32px/remove.svg';
            this.contextMenu.push(muteUserMenu);
            return;
        }


        if (this.userPostItem.following) {

            const followUserMenu = new ContextMenu();
            followUserMenu.title = 'Unfollow';
            followUserMenu.description = 'Stop seeing posts and unfollow';
            followUserMenu.id = 3;
            followUserMenu.iconUrl = '/assets/images/icons/32px/remove.svg';
            this.contextMenu.push(followUserMenu);

            if (this.userPostItem.muted) {
                const muteUserMenu = new ContextMenu();
                muteUserMenu.title = 'Unmute';
                muteUserMenu.description = 'Stop seeing posts but continue following';
                muteUserMenu.id = 5;
                muteUserMenu.iconUrl = '/assets/images/icons/32px/remove.svg';
                this.contextMenu.push(muteUserMenu);
            } else {
                const muteUserMenu = new ContextMenu();
                muteUserMenu.title = 'Mute';
                muteUserMenu.description = 'Stop seeing posts but continue following';
                muteUserMenu.id = 5;
                muteUserMenu.iconUrl = '/assets/images/icons/32px/mute.svg';
                this.contextMenu.push(muteUserMenu);
            }

        } else {

            const followUserMenu = new ContextMenu();
            followUserMenu.title = 'Follow';
            followUserMenu.description = 'Start seeing posts and follow';
            followUserMenu.id = 3;
            followUserMenu.iconUrl = '/assets/images/icons/32px/add.svg';
            this.contextMenu.push(followUserMenu);
        }

        const reportUserMenu = new ContextMenu();
        reportUserMenu.title = 'Report';
        reportUserMenu.description = 'Report this post for abuse';
        reportUserMenu.id = 4;
        reportUserMenu.iconUrl = '/assets/images/icons/32px/report.svg';
        this.contextMenu.push(reportUserMenu);

    }

    private isCurrentUserPost(currentUserId: string): boolean {
        return this.userPostItem.createdById === currentUserId;
    }

    contextMenuClicked(item: ContextMenu): void {

        switch (item.id) {
            case 1:
                this.sharePost();
                break;
            case 2:
                this.deletePost();
                break;
            case 3:
                this.toggleFollowUser();
                break;
            case 4:
                this.reportPost();
                break;
            case 5:
                this.toggleMuteUser();
                break;
        }
        this.drawerMenuComponent.toggleMenu(false);
    }

    deletePost(): void {

        this.feedService.deleteUserPost(this.userPostItem.id);
    }

    private reportPost(): void {

        const dlg = this.dialogService.openDialog('Report this post for abuse', UserFeedbackComponent, '', '');

        dlg.afterClosed.pipe(takeUntil(this.teardown$))
            .subscribe((reason: string) => {
                if (!reason || !reason.trim()) return;

                this.feedService.reportPost(this.userPostItem.id, reason)
                    .pipe(takeUntil(this.teardown$))
                    .subscribe(resp => {
                        this.drawerMenuComponent.toggleMenu(false);
                        this.toastrService.success('Post reported successfully!');
                    });
            });

    }

    toggleMuteUser(): void {

        this.userPostItem.muted = !this.userPostItem.muted;

        const service$ = this.userPostItem.muted
            ? this.friendshipService.muteUser(this.userPostItem.createdById)
            : this.friendshipService.unMuteUser(this.userPostItem.createdById);

        const msgAction = this.userPostItem.muted ? 'muted' : 'un-muted';

        service$.pipe(takeUntil(this.teardown$))
            .subscribe((resp) => {
                this.toastrService.success(`User successfully ${msgAction}`);
                this.muteStatusChange(this.userPostItem.muted);
            });
    }

    private muteStatusChange(muted: boolean): void {


        this.feedService.updateUserMuteStatus({
            userId: this.userPostItem.createdById,
            muted: muted,
            following: this.userPostItem.following
        });

    }

    private toggleFollowUser(): void {

        if (!this.userPostItem.following) {

            this.friendshipService.followUser(this.userPostItem.createdById)
                .pipe(takeUntil(this.teardown$)).subscribe((resp: FollowUserResponse) => {

                    if (resp.userFollowed) {
                        this.userPostItem.following = true;
                        this.toastrService.success(`User successfully followed`);
                    }
                    if (resp.approvalRequired) {
                        this.userPostItem.following = false;
                        this.toastrService.success(`Follow request has sent successfully`);
                    }
                    if (resp.approvalPending) {
                        this.userPostItem.following = false;
                        this.toastrService.info(`Follow request pending.`);
                    }
                    this.followingStatusChange(this.userPostItem.following);
                });
        } else {
            this.friendshipService.unFollowUser(this.userPostItem.createdById)
                .pipe(takeUntil(this.teardown$)).subscribe(resp => {
                    this.userPostItem.following = false;
                    this.toastrService.success(`User successfully un-followed`);
                    this.followingStatusChange(this.userPostItem.following);
                });
        }
    }

    private followingStatusChange(following: boolean): void {

        this.feedService.updateUserFollowStatus({
            userId: this.userPostItem.createdById,
            muted: this.userPostItem.muted,
            following: following,
        });
    }

    sharePost() {
        this.model = {
            url: this.feedService.getFeedUrl(this.userPostItem.id)
        }
        const dlg = this.dialogService.openDialog('Share Your Post', SocialMediaDialogComponent, 'model', this.model);

    }

}
