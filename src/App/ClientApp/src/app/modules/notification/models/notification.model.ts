export class Notification {
  id:string;
  forUserId: string;
  forUserDisplayName: string;
  fromUserId:string;
  fromUserDisplayName:string;
  message: string;
  type: string;
  additionalData: any;
  isRead: boolean;
  createdAt:Date;
}


export enum NotificationType {
  PlainText = 'PlainText',
  FollowRequestSent = 'FollowRequestSent',
  PostLiked = 'PostLiked',
  DirectMessageReceived = 'DirectMessageReceived',
  RedirectToView = 'RedirectToView',
  PartieInvitation = 'PartieInvitation'
}

export class NotificationSetting {
  id: string;
  username: string;
  name: string;
  description: string;
  emailNotification: boolean;
  pushNotification: boolean;
}

export class UserNotifications {
  userId: string;
}

export class UserNotificationById {
  userId: string;
  notificationId: string;
}



export class UpdateNotificationSettings {
  notificationId: string;
  emailNotification: boolean;
  pushNotification: boolean;



}

