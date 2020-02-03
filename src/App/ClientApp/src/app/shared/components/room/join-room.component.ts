import { Component, OnInit } from '@angular/core';
import { Subject, of } from 'rxjs';
import { takeUntil, delay } from 'rxjs//operators';
import { Router } from '@angular/router';

//Models
import { DialogRef } from '@partie/shared/models/dialog/dialog-ref';
import { JoinRoom, JoinRoomResponse, JoiningReuqestType } from '@partie/room/models/room.model';
import { FollowUserResponse } from '@partie/profile/models/fiendship.model';


//Services
import { FriendshipService } from '@partie/shared/services/friendship.service';
import { RoomService } from '@partie/room/services/room.service';
import { CurrentUserService, ICurrentUser } from '@partie/core/services/current-user.service';
import { SignalRService } from '@partie/core/services/signalr.service';
import { PartieToastrService } from '@partie/core/services/partie-toastr.service';
import { UiUpdatesManagerService } from '@partie/core/services/ui-updates-manager.service';

@Component({
    selector: 'partie-join-room',
    templateUrl: './join-room.component.html',
    styleUrls: []
})
export class JoinRoomComponent implements OnInit {

    model: JoinRoom;
    currentUser: ICurrentUser;
    joiningType = JoiningReuqestType;
    isFollower = false;

    //Private fields
    private teardown$ = new Subject<void>();

    constructor(private readonly dialog: DialogRef,
        private readonly roomService: RoomService,
        private readonly currentUserService: CurrentUserService,
        private readonly router: Router,
        private readonly signalRService: SignalRService,
        private readonly friendshipService: FriendshipService,
        private readonly partieToastService: PartieToastrService,
        private readonly uiUpdateManager: UiUpdatesManagerService
    ) {
      
    }

    ngOnInit() {

        this.bindCurrentUser();
        this.subscribeToServerPushChanges();

    }

    private bindCurrentUser(): void {

        this.currentUserService.afterCurrentUserChanged
            .pipe(takeUntil(this.teardown$))
            .subscribe(resp => {
                this.currentUser = resp as ICurrentUser;
                this.isFollower = this.model.roomHostFollowers.filter(x => x.followerUserId === this.currentUser.id).length > 0;
                this.model.joiningRequestType =
                    this.roomService.getJoiningRequestType(this.isFollower, this.model, this.model.joinRoomRequestStatus);
            });
    }

    ngOnDestroy(): void {
        this.teardown$.next();
        this.teardown$.complete();
    }

    joinRoom(): void {

        this.roomService.joinRoom(this.model.roomId)
            .pipe(takeUntil(this.teardown$))
            .subscribe((joinRoomResponse: JoinRoomResponse) => {
                if (joinRoomResponse.newlyJoined || joinRoomResponse.rejoined) {

                    const currentUser = this.currentUser;
                    this.signalRService.sendToServer('joinRoom', this.model.roomId, currentUser.id, currentUser.displayName);
                }
                this.navigateToChatRoom();
            });
    }

    joinRoomRequest(): void {

        this.roomService.joinRoomRequest(this.model.roomId)
            .pipe(takeUntil(this.teardown$))
            .subscribe(resp => {
                this.onBackButtonClick(null);
                this.partieToastService.success(`Join room request sent successfully`);
                this.router.navigate(['partie']);
            });
    }


    follow(): void {

        this.friendshipService.followUser(this.model.roomHostId)
            .pipe(takeUntil(this.teardown$)).subscribe((resp: FollowUserResponse) => {
                if (resp.userFollowed) {
                    this.isFollower = resp.userFollowed;
                    this.model.joiningRequestType =
                        this.roomService.getJoiningRequestType(this.isFollower, this.model, null);
                } else if (resp.approvalRequired) {
                  this.partieToastService.success(`Follow request has sent successfully`);
                } else {
                    this.partieToastService.info(`Follow request pending.`);
                }
        });
    }

    private navigateToChatRoom(): void {
        this.onBackButtonClick(null);
        this.router.navigate([`partie/${this.model.roomId}/chat`]);
    }

    onBackButtonClick(evt: MouseEvent) {
        this.dialog.close();
    }

    onDialogClick(evt: MouseEvent) {
        evt.stopPropagation();
    }

    private subscribeToServerPushChanges(): void {
      this.uiUpdateManager.userFollowChanged
        .pipe(takeUntil(this.teardown$))
          .subscribe((pl: any) => {
              if (this.model.roomHostId === pl.followedUserId) {
                  this.isFollower = true;
                  this.model.roomHostFollowersCount = String((Number(this.model.roomHostFollowersCount)) + 1);
              }
          });


    }

}
