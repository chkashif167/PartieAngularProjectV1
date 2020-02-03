export class ChatMessageResponse {
  vsId:number;
  id: string;
  message: string;
  userDisplayName: string;
  userId: string;
  roomId: string;
  timestamp: string;
  timestampString:string;
  messageType: ChatMessageTypeEnum;
  userAvatar:string;
}

export class ChatMessageRequest {
  roomId: string;
  message: string;
  messageType: string;
}


export enum ChatMessageTypeEnum {

  UserJoined = 'UserJoined',
  UserLeft = 'UserLeft',
  UserBanned = 'UserBanned',
  Regular = 'Regular',
  PartieCommenced = 'PartieCommenced',
  PartieEnded = 'PartieEnded',
  PartieEndedSuccessfully = 'PartieEndedSuccessfully'
}
