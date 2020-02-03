export class RateRoom {

  constructor() {
    this.rating = 0;
    this.cancelled = true;
    this.browserClosed = false;
  }

  roomId: string;
  userId: string;
  rating: number;
  badgesReceived: string;
  feedback: string;
  cancelled: boolean;
  browserClosed:boolean;
}


export class Badge {
  id: string;
  title: string;
  description: string;
  selected: boolean;
  sortOrder: number;
}

export class UserBadge {
  userId: string;
  badgeId: string;
  title: string;
  description: string;
  total: number;
  sortOrder: number;
  badgeCode: number;
  hasWon: boolean;
  isComplimentToken: boolean;
}

export class BadgeStats {
  constructor() {
    this.complimentBadges = new Array<UserBadge>();
    this.achievementBadges = new Array<UserBadge>();
  }
  complimentBadges: UserBadge[];
  achievementBadges: UserBadge[];
}
