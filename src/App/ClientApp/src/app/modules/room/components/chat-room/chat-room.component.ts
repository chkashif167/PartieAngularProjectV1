
import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, from } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Datasource } from 'ngx-ui-scroll';

//Models
import { ChatMessageResponse, ChatMessageTypeEnum } from '@partie/room/models/chat-message.model';
import { RoomEndedResponse, GetRoomUsersResponse, GetRoomResponse } from '@partie/room/models/room.model';
import { Friend, ChatParticipant, FriendListChildComponentsEnum } from '@partie/shared/models/friends-list/friend.model';
import { RateRoom, Badge } from '@partie/room/models/rate-host/rate-host.model';
import { ActionConfirmation } from '@partie/shared/models/action-confirmation/action-confirmation.model';
import { ContextMenu } from '@partie/theme/models/context-menu.model'

//Services
import { MessageBus } from '@partie/core/message-bus/message-bus';
import { RoomService } from '@partie/room/services/room.service';
import { SignalRService } from '@partie/core/services/signalr.service';
import { PartieToastrService } from '@partie/core/services/partie-toastr.service';
import { CurrentUserService, ICurrentUser } from '@partie/core/services/current-user.service';
import { FileService } from '@partie/core/services/file.service';
import { ChatDataSource } from '@partie/room/datasources/chat.datasource';
import { BadgeService } from '@partie/shared/services/badge/badge.service';
import { DialogService } from '@partie/shared/services/dialog/dialog.service';
import { EmojiService } from '@partie/core/services/emoji.service';
import { UiUpdatesManagerService } from '@partie/core/services/ui-updates-manager.service';
import { VirtualScrollWrapperService } from '@partie/core/services/virtual-scroll-wrapper.service';

//Components
//Constants
import { FriendTypeConstants } from '@partie/core/constants/FriendType.constants';
import { UserFeedbackComponent } from '@partie/room/components/user-feedback/user-feedback.component';
import { RateHostComponent } from '@partie/room/components/rate-host/rate-host.component';
import { SocialMediaDialogComponent } from '@partie/shared/components/social-media/social-media-dialog.component';
import { SocialMedia } from '@partie/shared/models/social-media/social-media.model';
import UserBanned = ChatMessageTypeEnum.UserBanned;
import UserJoined = ChatMessageTypeEnum.UserJoined;


@Component({
  selector: 'partie-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.css'],
  providers: [VirtualScrollWrapperService]
})
export class ChatRoomComponent implements OnInit, OnDestroy {

  room: GetRoomResponse;
  isHost = false;
  commaSeparatedRoomUserNames: string;
  moreRoomUsersCount = 0;
  roomUsers: GetRoomUsersResponse[];
  showEmojiMart = false;

  @ViewChild('viewport') viewportElement: ElementRef;


  message = '';
  chatDataSource: ChatDataSource;
  currentUser: ICurrentUser;
  contextMenu: ContextMenu[];
  roomId: string;
  model: SocialMedia;

  roomHint = 'Say anything you want, be nice.';
  messagePlaceHolder = this.roomHint;

  chatMessageType = ChatMessageTypeEnum;

  //Private fields
  private teardown$ = new Subject<void>();



  constructor(private readonly roomService: RoomService,
    private readonly signalRService: SignalRService,
    private readonly currentUserService: CurrentUserService,
    private readonly route: ActivatedRoute,
    private readonly messageBus: MessageBus,
    private readonly renderer: Renderer2,
    private readonly fileService: FileService,
    private readonly badgeService: BadgeService,
    private readonly dialogService: DialogService,
    private readonly router: Router,
    private readonly emojiService: EmojiService,
    private readonly toastrService: PartieToastrService,
    private readonly uiUpdateManager: UiUpdatesManagerService,
    public virtualScrollService: VirtualScrollWrapperService) {

    //replace bg-dark by bg-black
    this.renderer.removeClass(document.body, 'bg-dark');
    this.renderer.addClass(document.body, 'bg-black');
    this.chatDataSource = new ChatDataSource(null, this.roomService, this.fileService);
    this.room = new GetRoomResponse();
    this.roomUsers = [];
    this.contextMenu = new Array<ContextMenu>();



  }

  ngOnInit() {

    this.subscribeToServerPushChanges();
    this.bindCurrentUser();
   
    this.route.params.pipe(takeUntil(this.teardown$)).subscribe(params => {

      const roomId = params['roomId'];
      this.roomId = roomId;
      this.bindRoom(roomId);
      this.bindRoomUsers(roomId);
     
      this.getRoomChats(1);
      this.virtualScrollService.viewportElement = this.viewportElement;
      this.registerChatHubMethods(roomId);
    });
    
    this.virtualScrollService.bof$
      .pipe(takeUntil(this.teardown$))
      .subscribe((item: any) => {
        console.log('Page Number', item.pageNumber);
        this.getRoomChats(item.pageNumber, true);
      });
  }



  private getRoomChats(pageNumber:number, prepend:boolean = false) {
    const pageSize: number = 50;

    this.roomService.getRoomChat(this.roomId, pageNumber, pageSize)
      .pipe(takeUntil(this.teardown$))
      .subscribe((chats: ChatMessageResponse[]) => {
        if (prepend) {
          this.virtualScrollService.prependData(chats);
        } else {
          this.virtualScrollService.appendData(chats.reverse());
        }
      });
  }


  
  private addChatMessage(name: string, timestampString: string, message: ChatMessageResponse): void {

    message.userDisplayName = name;
    message.timestampString = this.formatTimestamp(timestampString);

    this.virtualScrollService.appendData(message);
  }

  ngOnDestroy(): void {

    this.removeSignalRConnectionFromRoom();

    this.teardown$.next();
    this.teardown$.complete();
    //replace bg-black by bg-dark
    this.renderer.removeClass(document.body, 'bg-black');
    this.renderer.addClass(document.body, 'bg-dark');
  }

  showRoomUsers(): void {


    const friends = [];

    for (let roomUser of this.roomUsers) {
      const friend = new ChatParticipant();
      friend.id = roomUser.userId;
      friend.displayName = roomUser.displayName;
      friend.type = FriendTypeConstants.follower;
      friend.roomId = this.roomId;
      if (roomUser.userId === this.room.hostId) {
        friend.isHost = true;
      }
      friends.push(friend);
    }


    const dlg = this.dialogService.openFriendsList(`${friends.length} Participants`, friends, FriendListChildComponentsEnum.RemoveRoomUserButtonComponent);
    dlg.afterClosed.pipe(takeUntil(this.teardown$)).subscribe((gp: string) => console.log(gp));
  }

  showJoinRoomRequests(): void {

    const dlg = this.dialogService.openJoinRoomRequestsDialog('Pending Requests', this.room.id);

    dlg.afterClosed.pipe(takeUntil(this.teardown$)).subscribe((gp: string) => {
      console.log(gp);
    });
  }

  inviteFollower(): void {
    const dlg = this.dialogService.openInvitationDialog('Invitation', this.room.id);
    dlg.afterClosed.pipe(takeUntil(this.teardown$)).subscribe((gp: string) => {
      console.log(gp);
    });
  }

  sendMessage(): void {
    if (!this.message) return;
    this.sendMessageInternal();
  }

  sendMessageInternal() {
    this.message = this.emojiService.replaceEmoji(this.message);
    this.signalRService.sendToServer('sendToRoom',
      this.room.id,
      this.currentUser.id,
      this.currentUser.displayName,
      this.message);
    this.message = '';
    this.showEmojiMart = false;
  }

  trackByFn(index, item) {
    return index; // or item.id
  }

  toggleChatRoomFeedMenu(): void {

    if (!this.room.partieEnded) {

    }
  }

  onPartieEnded(): void {

    const model = new ActionConfirmation();

    model.modelClass = 'leave-modal';
    model.heading = 'Are you sure you want to end the partie';
    const dlg = this.dialogService.openActionConfirmation(model);

    dlg.afterClosed.pipe(takeUntil(this.teardown$)).subscribe((action: boolean) => {

      if (action) {
        this.roomService.endRoom(this.room.id)
          .pipe(takeUntil(this.teardown$))
          .subscribe((resp: RoomEndedResponse) => {
            const temp = resp;
            this.signalRService.sendToServer('endRoom', this.room.id, this.currentUser.id, this.currentUser.displayName, resp.partieSucceeded)
              .then(endRoomResp => {
                this.router.navigate(['partie']);
              });
          });
      }

    });
  }

  onPartieLeft(): void {

    const model = new ActionConfirmation();

    model.modelClass = 'leave-modal';
    model.heading = 'Are you sure you want to leave the partie';

    const dlg = this.dialogService.openActionConfirmation(model);

    dlg.afterClosed.pipe(takeUntil(this.teardown$)).subscribe((action: boolean) => {

      if (action) {

        this.roomService.leaveRoom(this.room.id).pipe(takeUntil(this.teardown$)).subscribe(resp => {
          this.signalRService
            .sendToServer('leaveRoom', this.room.id, this.currentUser.id, this.currentUser.displayName).then(resp => {
              this.router.navigate(['partie']);
            });
        });

      }
      this.toggleChatRoomFeedMenu();
    });
  }

  onPartieSettings(): void {
    this.toggleChatRoomFeedMenu();

    const dlg = this.dialogService.openEditRoomDialog('', this.room.id);


  }

  addEmoji($event): void {

    this.message += $event.emoji.native;
  }

  toggleEmojiMart(): void {

    this.showEmojiMart = !this.showEmojiMart;
  }

  onMessageFocused() {
    this.showEmojiMart = false;
  }

  private bindRoomUsers(roomId: string): void {

    this.roomService.getRoomUsers(roomId).pipe(takeUntil(this.teardown$))
      .subscribe((roomUsers: GetRoomUsersResponse[]) => {
        this.roomUsers = roomUsers;
        this.bindRoomUsersNamesAndCount();
      });
  }

  private bindRoomUsersNamesAndCount(): void {

    const roomUserNames = this.roomUsers.map(p => p.displayName);
    if (roomUserNames.length > 3) {

      this.commaSeparatedRoomUserNames = roomUserNames.slice(0, 3).join(', ');
      this.moreRoomUsersCount = roomUserNames.slice(3, roomUserNames.length).length;
      return;
    }
    this.commaSeparatedRoomUserNames = roomUserNames.slice(0, roomUserNames.length).join(', ');
  }

  private bindCurrentUser(): void {

    this.currentUserService.afterCurrentUserChanged
      .pipe(takeUntil(this.teardown$)).subscribe(resp => {

        this.currentUser = resp as ICurrentUser;
      });
  }

  private registerChatHubMethods(roomId: string): void {

    this.messageBus.afterStart.pipe(takeUntil(this.teardown$))
      .subscribe(() => {

        console.log(roomId);
        this.addSignalRConnectionIntoRoom(roomId);

        this.signalRService.getFromServer('echo',
          (name: string, timestampString: string, message: ChatMessageResponse) => {

            this.addChatMessage(name, timestampString, message);
            //Check if its ban user message.
            if (message.messageType === ChatMessageTypeEnum.UserBanned  && this.currentUser.id === message.userId) {
              this.toastrService.error("You are banned by the host.", "Banned");
              this.router.navigate(['partie']);
            }

            if (message.messageType === ChatMessageTypeEnum.UserLeft && this.currentUser.id === message.userId) {
              this.router.navigate(['partie']);
            }

            if (message.messageType === ChatMessageTypeEnum.UserJoined || message.messageType === ChatMessageTypeEnum.UserLeft || message.messageType === ChatMessageTypeEnum.UserBanned) {
              this.bindRoomUsers(roomId);
            }


          });

        this.signalRService.getFromServer('roomEnded',
          (name: string, timestampString: string, message: ChatMessageResponse) => {

            this.addChatMessage(name, timestampString, message);
            if (message.messageType === ChatMessageTypeEnum.PartieEndedSuccessfully) {
              this.rateHost();
            }
            else {
              this.router.navigate(['partie']);
            }

          });

        this.signalRService.getFromServer('broadcastMessage', (name: string, payload: any) => {
          if (name === 'PartieCommenced') {
            this.bindRoom(payload.roomId);
          }
        });


      });
  }

  private rateHost(): void {

    this.badgeService.getBadges().pipe(takeUntil(this.teardown$))
      .subscribe(badges => {

        this.showRateHosDialog(badges);
      });
  }

  private showRateHosDialog(badges: Badge[]): void {

    const dlg = this.dialogService.openDialog('Rate Host', RateHostComponent, 'badges', badges);

    dlg.afterClosed.pipe(takeUntil(this.teardown$))
      .subscribe((rateRoomResp: RateRoom) => {

        this.getFeedback(rateRoomResp);
      });
  }

  private getFeedback(rateRoom: RateRoom): void {
    
    if (rateRoom.rating <= 2 && !rateRoom.browserClosed) {

      const dlg_feed = this.dialogService.openDialog('Feedback', UserFeedbackComponent, 'model', rateRoom, null);

      dlg_feed.afterClosed.pipe(takeUntil(this.teardown$))
        .subscribe(rateRoomResp => {

          this.rateRoom(rateRoomResp as RateRoom);
        });

    }
    else
      this.rateRoom(rateRoom);

  }

  private rateRoom(rateRoom: RateRoom): void {

    rateRoom.roomId = this.room.id;
    rateRoom.userId = this.currentUser.id;

    this.roomService.rateRoom(rateRoom)
      .pipe(takeUntil(this.teardown$))
      .subscribe(rateRoom => {
        this.router.navigate(['partie']);
      });
  }

  formatTimestamp(dateTime: any): string {
    const formatOptions = {
      hour12: true,
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    };

    const tmp = new Date(dateTime).toLocaleString('en-GB', formatOptions);
    return tmp.replace(' ', '-').replace(' ', '-');
  }


  private bindRoom(roomId: string): void {

    this.roomService.getRoom(roomId)
      .pipe(takeUntil(this.teardown$))
      .subscribe((roomResp: GetRoomResponse) => {

        if (roomResp) {

          const room = roomResp as GetRoomResponse;
          this.room = room;

          this.messagePlaceHolder = !room.partieStarted
            ? 'You cannot send message because the partie has not commenced yet.'
            : this.roomHint;

          //Checks host
          this.currentUserService.afterCurrentUserChanged
            .pipe(takeUntil(this.teardown$))
            .subscribe((resp: ICurrentUser) => {

              this.setHost(roomResp.hostId, resp.id);
              this.buildContextMenu();
            });
        }
      });
  }

  private setHost(userId: string, currentUserId: string): void {

    this.isHost = userId === currentUserId;
  }

  private addSignalRConnectionIntoRoom(roomId: string): void {
    this.signalRService.sendToServer('addConnectionIntoRoom', roomId);
  }

  private removeSignalRConnectionFromRoom(): void {
    this.signalRService.sendToServer('removeConnectionFromRoom', this.room.id);
  }

  private onCommencePartie(): void {

    this.roomService.commenceRoom(this.room.id)
      .pipe(takeUntil(this.teardown$))
      .subscribe(resp => {

        this.signalRService.sendToServer("commencePartie", this.room.id, this.currentUser.id, this.currentUser.displayName);
        this.toastrService.success('Partie successfully commenced!');

      });
  }

  buildContextMenu(): void {

    if (this.room.partieEnded) {
      this.contextMenu = null;
      return;
    }

    this.contextMenu = new Array<ContextMenu>();

    let item = new ContextMenu();

    if (this.isHost) {

      item = {
        id: 1,
        title: 'Share',
        description: 'Share partie in social media',
        iconUrl: '/assets/images/icons/misc/share-partie.svg'
      } as ContextMenu;
      this.contextMenu.push(item);


      if (this.room.partieStarted) {

        item = {
          id: 2,
          title: 'End Partie',
          description: 'Lorem ipsum dolor sit amet, consectetur',
          iconUrl: '/assets/images/icons/misc/end-partie.svg'
        } as ContextMenu;
        this.contextMenu.push(item);

      } else {

        item = {
          id: 3,
          title: 'Commence Partie',
          description: 'Lorem ipsum dolor sit amet, consectetur',
          //iconUrl: "/assets/images/icons/misc/end-partie.svg"
        } as ContextMenu;
        this.contextMenu.push(item);
      }

      item = {
        id: 4,
        title: "Partie Settings",
        description: "Lorem ipsum dolor sit amet, consectetur",
        iconUrl: "/assets/images/icons/misc/partie-settings.svg"
      } as ContextMenu;
      this.contextMenu.push(item);

    } else {
      item = {
        id: 5,
        title: "Leave Partie",
        description: "Lorem ipsum dolor sit amet, consectetur",
        iconUrl: "/assets/images/icons/24px/back.svg"
      } as ContextMenu;
      this.contextMenu.push(item);
    }
  }

  contextMenuClicked(item: ContextMenu): void {
    switch (item.id) {
      case 1:
        this.sharePartie();
        break;
      case 2:
        this.onPartieEnded();
        break;
      case 3:
        this.onCommencePartie();
        break;
      case 4:
        this.onPartieSettings();
        break;
      case 5:
        this.onPartieLeft();
        break;
    }
  }

  sharePartie() {
    this.model = {
      url: this.roomService.getRoomUrl(this.room.id)
    }
    const dlg = this.dialogService.openDialog('Share Your Partie', SocialMediaDialogComponent, 'model', this.model);
  }

  private subscribeToServerPushChanges(): void {
    this.uiUpdateManager.partieNameUpdated
      .pipe(takeUntil(this.teardown$))
      .subscribe((pl: any) => {
        if (this.room.id === pl.roomId) {
          this.room.displayName = pl.name;
          this.room.description = pl.description;
        }
      });

  }

}

