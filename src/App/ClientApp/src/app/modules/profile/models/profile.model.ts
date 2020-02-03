import { UserGamePlatform } from '@partie/modules/game/models/game.model';

export class Profile {

    id: string;
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth: string;
    phoneNumber: string;
    ipAddress: string;
    latitude: string;
    longitude: string;
    city: string;
    country: string;
    rankWorldwide?: number;
    rankCountrywide?: number;
    score: number;
    displayName: string;
    externalLink: string;
    biography: string;
    partiesCount: number;
    badgesCount: number;
    gamingPlatforms: UserGamePlatform[];
    roles: string[];
    avatarExists: boolean;


    //toggle view state
    muted = false;
    self = false;
    currentUserIsFollowing = false;
}
