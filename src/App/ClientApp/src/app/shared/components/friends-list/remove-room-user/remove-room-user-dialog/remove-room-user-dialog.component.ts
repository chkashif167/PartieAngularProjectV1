import { Component, OnInit,Input, Output, EventEmitter } from '@angular/core';
import { BanReason,BannedUser,Friend} from '@partie/shared/models/friends-list/friend.model';

import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs//operators';
import { Subject } from 'rxjs';

//Services
import { SignalRService } from '@partie/core/services/signalr.service';
import { CurrentUserService, ICurrentUser } from '@partie/core/services/current-user.service';
import { PartieToastrService } from '@partie/core/services/partie-toastr.service';
import { BanUsersService } from '@partie/shared/services/ban-users.service';



@Component({
  selector: 'partie-remove-room-user-dialog',
  templateUrl: './remove-room-user-dialog.component.html',
  styleUrls: ['./remove-room-user-dialog.component.css']
})
export class RemoveRoomUserDialogComponent implements OnInit {
  private teardown$ = new Subject<void>();
  @Input() friend: Friend;
  getBanReasons: BanReason[];
  bannedUser: BannedUser;
  selectedUserId:string;
  banReasonId:string;
  currentUser: ICurrentUser;

  @Output() close = new EventEmitter<boolean>();

  constructor(private banUserService: BanUsersService,
    private readonly route: ActivatedRoute,
    private readonly currentUserService: CurrentUserService,
    private readonly partieToastrService: PartieToastrService,
    private readonly signalRService: SignalRService)
  { 
    this.getBanReasons=[];
    this.banReasonId="";
    this.bannedUser = new BannedUser();
  }

  ngOnInit() {
    this.currentUserService.afterCurrentUserChanged
    .pipe(takeUntil(this.teardown$)).subscribe(resp => {
      this.currentUser = resp as ICurrentUser;
    });

    this.banUserService.getBanUsersReasons()
    .pipe(takeUntil(this.teardown$))
    .subscribe(resp => {
      this.getBanReasons = resp;
      console.log('Participant', this.friend);
    });
  }

  
  ngOnDestroy(): void {
    this.teardown$.next();
    this.teardown$.complete();
  }

  banUser()
  {
    this.bannedUser.userId =this.friend.id;
    this.bannedUser.reasonId= this.banReasonId;
    this.bannedUser.hostId = this.currentUser.id;
    this.bannedUser.roomId= this.friend.roomId;

    this.banUserService.banUserFromRoom(this.bannedUser)
    .pipe(takeUntil(this.teardown$))
      .subscribe((resp: BannedUser) => {
      this.bannedUser = resp;
        this.partieToastrService.success("User is Successfully Banned", "Ban User From room");
        this.signalRService.sendToServer('BanUser', this.bannedUser.roomId, this.bannedUser.userId, this.friend.displayName);
        this.closeDialog(true);
    });
  }

  closeDialog(isBanned:boolean = false)
  {
    this.close.emit(isBanned);
  }
}
