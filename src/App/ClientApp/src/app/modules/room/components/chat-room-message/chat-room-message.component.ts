import { Component, OnInit, Input } from '@angular/core';

import { ChatMessageTypeEnum } from '@partie/room/models/chat-message.model';
//Services
import { FileService } from '@partie/core/services/file.service';


@Component({
  selector: 'partie-chat-room-message',
  templateUrl: './chat-room-message.component.html',
  styleUrls: ['./chat-room-message.component.css']
})
export class ChatRoomMessageComponent implements OnInit {

  @Input() userId: string;
  @Input() type: ChatMessageTypeEnum;
  @Input() userDisplayName: string;
  @Input() timestamp: string;
  @Input() message: string;

  messageType = ChatMessageTypeEnum;

  constructor(private readonly fileService: FileService,) {  }

  ngOnInit() {}

  getAvatarUrl(toUserId: string): string {
    
    return this.fileService.getProfileAvatarUrl(toUserId);
  }

  getDefaultAvatarUrl(toUserId: string): string {

    //console.log(`Param UID: ${toUserId} UserId: ${this.userId}`);
    return this.fileService.getDefaultAvatarUrl(toUserId);
  }
}
