export class ThreadDetail {

  constructor() {
    this.forUser = new ThreadParticipant();
    this.toUser = new ThreadParticipant();
    this.messages = new Array<Conversation>();
  }

  forUser: ThreadParticipant;
  toUser: ThreadParticipant;
  messages: Conversation[];
}


export class Conversation {
    id:string;
    userId: string;    
    userName:string;
    timestamp:string;
    message: string;
    deleted: boolean;

}

export class ThreadParticipant {
  id: string;
  displayName: string;
  directMessagingAllowed: boolean;
}


export class MessageThreadContainer {
  constructor() {
    this.threads = new Array<MessageThread>();
  }

  forUserDirectMessagingAllowed: boolean;
  threads: MessageThread[];
}

export class MessageThread {
  id: string;
  userId: string;
  userName: string;
  mostRecentMessage: string;
  timestamp: string;
}


export class DirectMessagingStatus {
  id: string;
  directMessagingAllowed:boolean;
}

export class ToggleDirectMessaging {
  disabled:boolean
}

