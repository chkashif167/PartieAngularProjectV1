import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ChatParticipant } from '../../../../models/friends-list/friend.model';





@Component({
  selector: 'partie-remove-room-user-button',
  templateUrl: './remove-room-user-button.component.html'
})
export class RemoveRoomUserButtonComponent implements OnInit {

  @Input() friend: ChatParticipant;

  @Output() userBanned = new EventEmitter<ChatParticipant>();

  showDialog: boolean;
  constructor() {
  }

  ngOnInit() {}

  openBanReasonDialog(): void {
    this.showDialog = true;
  }

  closeBanReasonDialog(isBanned:boolean): void {
    this.showDialog = false;
    if (isBanned) this.userBanned.emit(this.friend);
  }

}
