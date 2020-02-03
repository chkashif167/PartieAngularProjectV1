export class Game {
    id: string;
    title: string;
    tags: string;
    gameTypes: string;
    gamePlatforms: string;
    roleNames: string;
    expertise: string;
}

export class UserGamePlatform {
  constructor() {
    this.gamingPlatform = "";
    this.gamerId = "";
  }
    gamingPlatform: string;
    gamerId: string;
}
