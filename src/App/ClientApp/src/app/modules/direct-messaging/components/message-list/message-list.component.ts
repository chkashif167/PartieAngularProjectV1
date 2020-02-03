
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, switchMap } from 'rxjs/operators';

//Services
import { DirectChatService } from '@partie/direct-messaging/services/direct-chat.service'
import { FriendshipService } from '@partie/shared/services/friendship.service';
import { CurrentUserService, ICurrentUser } from '@partie/core/services/current-user.service';
import { DialogService } from '@partie/shared/services/dialog/dialog.service';
import { Friend, FriendListChildComponentsEnum } from '@partie/shared/models/friends-list/friend.model';

//Constants
import { FriendTypeConstants } from '@partie/core/constants/FriendType.constants';

// Models
import { MessageThreadContainer, MessageThread } from '@partie/direct-messaging/models/direct-message.model';
import { Follower } from '@partie/profile/models/followers.model';
import { ActionConfirmation } from '@partie/shared/models/action-confirmation/action-confirmation.model';

@Component({
  selector: 'partie-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})


export class MessageListComponent implements OnInit, OnDestroy {

  private teardown$ = new Subject<void>();

  //messageThreads: MessageThread[];
  followers: Follower[];
  //directMessagingAllowedByUser:boolean;

  constructor(
    private router: Router,
    private readonly friendshipService: FriendshipService,
    private readonly currentUserService: CurrentUserService,
    private readonly dialogService: DialogService,
    public  messageService: DirectChatService) {

    //this.messageThreads = new Array<MessageThread>();
    this.followers = [];
  }

  ngOnInit() {
    this.messageService.getThreads();
      //.pipe(takeUntil(this.teardown$))
      //.subscribe((resp: MessageThreadContainer) => {
      //  this.directMessagingAllowedByUser = resp.forUserDirectMessagingAllowed;
      //  this.messageThreads = resp.threads;
      //});

    

    this.currentUserService.afterCurrentUserChanged
      .pipe(switchMap((u:ICurrentUser) => {
        return this.friendshipService.getFollowers(u.id);
      }))
      .subscribe((resp: any) => {
        this.followers = resp.followers as Follower[] || [];
      });

  }
  deleteMessageThread():void {
    //alert("yes")
    const model = new ActionConfirmation();

    model.modelClass = 'leave-modal';
    model.heading = 'Are you sure you want to delete the message thread';

    const dlg = this.dialogService.openActionConfirmation(model);
   
  }
  navigateToConversation(userId: string, threadUserName: string) {
    
    this.router.navigate(['messages/conversation', userId]);
  }


  showFriends(): void {

    const friends = this.followers.map((f: Follower) => {
      const friend = new Friend();
      friend.id = f.followerUserId;
      friend.displayName = f.displayName;
      friend.friendTypeCount = f.totalFollowers;
      friend.type = FriendTypeConstants.follower;     
      friend.directMessagingAllowed = f.directMessagingAllowed;
      return friend;
    });

    const dlg = this.dialogService.openFriendsList('Message Friends',
      friends,
      FriendListChildComponentsEnum.DirectMessageFriendsComponent);
  }


  trackByFn(index, item) {
    return item.id;
  }

  
  ngOnDestroy(): void {

    this.teardown$.next();
    this.teardown$.complete();
  }

}
