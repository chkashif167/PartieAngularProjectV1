import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { DialogRef } from '@partie/shared/models/dialog/dialog-ref';
import { Friend } from '@partie/shared/models/friends-list/friend.model';

@Component({
  selector: 'partie-message-friend',
  templateUrl: './message-friend.component.html',
  styleUrls: ['./message-friend.component.css']
})
export class MessageFriendComponent implements OnInit {

  @Input() friend: Friend;

  constructor(private router: Router,
    private readonly dialog:DialogRef 
    ) { }

  ngOnInit() {
  }

  messageFriend(): void {

    this.dialog.close(this.friend);
    this.router.navigate(['messages/conversation', this.friend.id]);
  }


}
