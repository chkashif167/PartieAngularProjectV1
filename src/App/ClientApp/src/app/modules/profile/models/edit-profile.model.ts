import { StaticInjector } from '@angular/core/src/di/injector';
import { UserGamePlatform } from '../../game/models/game.model';

export class EditProfile {
    constructor() {

        this.firstName = '';
        this.lastName = '';
        this.email = '';
        this.emailVerified = true;
        //this.dateOfBirth = '';
        this.phoneNumber = '';
        this.country = '';
        this.biography = '';
        this.externalLink = '';
        this.gamingPlatforms = [];
        this.displayName = '';
        this.rankCountrywide = '';
        this.rankWorldwide = '';
        this.playStyle = '';
        this.linkedSocialAccountUserName = '';

    }

    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    email: string;
    emailVerified: boolean;
    phoneNumber: string;
    country: string;
    biography: string;
    externalLink: string;
    gamingPlatforms: UserGamePlatform[];
    displayName: string;
    rankWorldwide: string;
    rankCountrywide: string;
    rankCombined: string;
    playStyle: String;
    linkedSocialAccountUserName: string;

}


export class EditProfileResponse extends EditProfile {
    isPhoneNumberChanged: boolean;
    isEmailChanged: boolean;
}

export enum SocialMediaAccounts {
    Facebook = ('Facebook') as any,
    Google = ("Google") as any,
    Twitter = ("Twitter") as any
}
