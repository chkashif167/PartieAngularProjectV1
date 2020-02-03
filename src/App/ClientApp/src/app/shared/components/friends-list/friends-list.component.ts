import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


//Services
import { ICurrentUser, CurrentUserService } from '@partie/core/services/current-user.service';
import { RouteUtilityService } from '@partie/shared/services/route-utility.service'

//Models
import { DialogRef } from '@partie/shared/models/dialog/dialog-ref';
import { ChatParticipant,FriendListChildComponentsEnum } from '@partie/shared/models/friends-list/friend.model';


@Component({
  selector: 'partie-friends-list',
  templateUrl: './friends-list.component.html',
  styleUrls: ['./friends-list.component.css']
})
export class FriendsListComponent implements OnInit, OnDestroy {
  title: string;
  friends: ChatParticipant[] = [];
  childComponentName: FriendListChildComponentsEnum;
  componentType = FriendListChildComponentsEnum;
  currentUser: ICurrentUser;
  isHost:boolean;
  
  private teardown$ = new Subject<void>();

  constructor(
    private readonly currentUserService: CurrentUserService,
    private readonly dialog: DialogRef,
    private readonly routeService: RouteUtilityService) {

    this.isHost = false;
  }

  ngOnInit() {
    this.currentUserService.afterCurrentUserChanged
      .pipe(takeUntil(this.teardown$))
      .subscribe((user: ICurrentUser) => {
        this.currentUser = user;

        if (this.friends.filter(x => x.isHost).length > 0) {
          this.isHost = this.friends.filter(x => x.isHost)[0].id === this.currentUser.id;
        };

      });
  }


  removeParticipant(participant: ChatParticipant): void {
    this.friends = this.friends.filter(x => x.id !== participant.id);
  }

  ngOnDestroy() {
  }

  close(evt: MouseEvent) {
    this.dialog.close();
  }

  onDialogClick(evt: MouseEvent) {
    evt.stopPropagation();
  }

  navigateToProfile(id:string):void {
    this.dialog.close();
    this.routeService.navigateToUrl(`/profile/${id}`);

  }
}
