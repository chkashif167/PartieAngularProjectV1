
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

//Models
import {
  JoinRoom,
  SearchRoomResponse,
  GetJoinRoomRequestStatusResponse,
  RoomUserStatus
} from '@partie/room/models/room.model';

//Services
import { DialogService } from '@partie/shared/services/dialog/dialog.service';
import { FileService } from '@partie/core/services/file.service';
import { UtilityService } from '@partie/core/services/utility.service';
import { RoomService } from '@partie/room/services/room.service';
import { FriendshipService } from '@partie/shared/services/friendship.service';
import { CurrentUserService, ICurrentUser } from '@partie/core/services/current-user.service';
import { Follower } from '@partie/profile/models/followers.model';

@Component({
  selector: 'partie-room-list-item',
  templateUrl: './room-list-item.component.html',
  styleUrls: ['./room-list-item.component.css']
})
export class RoomListItemComponent implements OnInit, OnDestroy {

  @Input() room: SearchRoomResponse;
    roomGameImage: string;
    isHost: boolean;
    caption: string;

  currentUser: ICurrentUser;
  //Private fields
  private teardown$ = new Subject<void>();

  constructor(private readonly dialogService: DialogService,
    private readonly fileService: FileService,
    private readonly currentUserService: CurrentUserService,
    private readonly roomService: RoomService,
    private readonly friendshipService: FriendshipService,
    private readonly utilityService: UtilityService,
    private readonly router: Router) { }

  ngOnInit() {
    this.isHost = false;
      this.bindCurrentUser();
      this.getPartieCaption();
  }

  private bindCurrentUser(): void {

    this.currentUserService.afterCurrentUserChanged
      .pipe(takeUntil(this.teardown$))
      .subscribe(resp => {
        this.currentUser = resp as ICurrentUser;
          this.roomGameImage = this.fileService.getGameImageUrl(this.room.gameId);
          if (this.room.hostId === this.currentUser.id) {
            this.isHost = true;
          }
      });
  }

  navigateToProfile(e) {
   
    e.stopPropagation();
    this.router.navigate([`profile/${this.room.hostId}`]);
    
    
  }

  joinRoom(): void {

    const currentUserIsRoomHost = this.roomService.currentUserIsRoomHost(this.room.hostId, this.currentUser.id);
    if (currentUserIsRoomHost) {

      this.navigateToChatRoom();
      return;
    }

    const model = this.createJoinRoomModel();

    const followerResponse$ = this.friendshipService.getFollowers(model.roomHostId);
    const roomStatus$ = this.roomService.getJoinRoomRequestStatus(model.roomId); 
    const roomUserStatus$ = this.roomService.getRoomUserStatus(model.roomId);

    combineLatest(followerResponse$,
        roomStatus$,
        roomUserStatus$,
      (followerResponse: any, roomStatus: GetJoinRoomRequestStatusResponse, roomUserStatus: any) => ({
          followerResponse,
          roomStatus,
          roomUserStatus
        }))
      .pipe(takeUntil(this.teardown$))
      .subscribe((result: any) => {

        const followers = result.followerResponse.followers as Follower[];

        this.bindHostFollowers(model, followers);
        this.bindJoinRoomRequestStatus(model, result.roomStatus);

        const roomUserStatusResponse = result.roomUserStatus;

        if (this.utilityService.isEmpty(roomUserStatusResponse) ||
          roomUserStatusResponse.status === RoomUserStatus.userLeft) {

          this.openJoinRoomDialog(model);
          return;
        }
        this.navigateToChatRoom();


      });

  }
  

  navigateToChatRoom(): void {
    this.router.navigate([`partie/${this.room.id}/chat`]);
  }

  private createJoinRoomModel(): JoinRoom {

    const model = new JoinRoom();
    model.roomId = this.room.id;
    model.roomDisplayName = this.room.displayName;
    model.roomDescription = this.room.description;
    model.roomPrivate = this.room.private;
    model.roomCreateDate = this.room.createdDate;
    model.roomPartieStarted = this.room.partieStarted;
    model.roomPartieEnded = this.room.partieEnded;
    model.roomPartieSucceeded = this.room.partieSucceeded;
    model.roomGameId = this.room.gameId;
    model.roomGameName = this.room.gameTitle;
    model.roomTags = this.room.tagsList;
    model.roomHostId = this.room.hostId;
    model.roomHostName = this.room.hostName;
    model.roomHost = this.currentUser.id === this.room.hostId;

    return model;
  }

  private bindHostFollowers(model: JoinRoom, followers: Follower[]): void {

    model.roomHostFollowers = followers;
    model.roomHostFollowersCount = followers.length.toString();
  }

  private bindJoinRoomRequestStatus(model: JoinRoom, respStatus: GetJoinRoomRequestStatusResponse): void {
    model.joinRoomRequestStatus = respStatus;
    const isFollower = model.roomHostFollowers.filter(item => item.followerUserId === this.currentUser.id).length > 0;
    model.joiningRequestType = this.roomService.getJoiningRequestType(isFollower, model, respStatus);
  }

  private openJoinRoomDialog(model: JoinRoom): void {
    const dlg = this.dialogService.openJoinRoomDialog('Join Room', model);
    dlg.afterClosed.pipe(takeUntil(this.teardown$)).subscribe((gp: string) => {

      console.log(gp);
    });
  }


  ngOnDestroy(): void {
    this.teardown$.next();
    this.teardown$.complete();
    }

  getPartieCaption(): void {

      if (this.room.myCommencedPartie) {
          this.caption = "(Commenced)";
      } else if (this.isHost) {
        this.caption = "(Host)";
      } else if (this.room.alreadyJoined) {
        this.caption = "(Already Joined)";
      }

  }

}
