import { extend } from 'webdriver-js-extender';

export class Friend {
  id:string;
  displayName: string;
  friendTypeCount: string;
  type: string;
  directMessagingAllowed: boolean;
  roomId: string;
  tag:string;
}
export class ChatParticipant extends Friend {
isHost :boolean=false;
}


export enum FriendListChildComponentsEnum {
  RemoveUserComponent,
  FollowUnfollowUserComponent,
  DirectMessageFriendsComponent,
  RemoveRoomUserButtonComponent
}

export class BanReason {
  id:string;
  reason: string;
}

export class BannedUser
{
   roomId:string;
   userId:string;
   reasonId:string;
   hostId:string;
}

export class GetFollowRequestResponse {
  id: string;
  followRequestById: string;
  displayName: string;
}
