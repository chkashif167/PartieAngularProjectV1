export class Follower {

  followerUserId: string;
  userTag: string;
  displayName: string;
  totalFollowers: string;
  directMessagingAllowed: boolean;
}

export class Following {

  followingUserId: string;
  userTag: string;
  displayName: string;
  totalFollowers: string;
}

export class MutedUser {

  mutedUserId: string;
  userTag: string;
  displayName: string;
  totalFollowers: string;
}

export class MutedUsersResponse {

  constructor() {
    this.mutedUsers = [];
  }
  mutedUsers: MutedUser[];
}
