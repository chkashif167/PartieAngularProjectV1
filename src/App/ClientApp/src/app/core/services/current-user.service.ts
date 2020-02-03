import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ReplaySubject } from 'rxjs';

import { ApiBaseService } from '@partie/shared/services/api-base.service';
import { ConfigurationService } from '@partie/shared/services/configuration.service';
import { UtilityService } from '@partie/core/services/utility.service';
import { UiUpdatesManagerService } from '@partie/core/services/ui-updates-manager.service';
import { AuthService } from '@partie/core/services/auth.service';
import { SubscribeStatusEnum } from '@partie/modules/subscription/Models/Subscription.model';
import { UserGamePlatform } from '@partie/modules/game/models/game.model';

@Injectable({
  providedIn: 'root'
})
export class CurrentUserService extends ApiBaseService {

  private currentUser: ICurrentUser;
  private readonly onCurrentUserChanged = new ReplaySubject<ICurrentUser>(1);
  afterCurrentUserChanged = this.onCurrentUserChanged.asObservable();

  constructor(private readonly authService: AuthService,
    public readonly httpClient: HttpClient,
    public readonly configurationService: ConfigurationService,
    public readonly utilityService: UtilityService,
    public readonly uiUpdateManager: UiUpdatesManagerService,
  ) {

    super(httpClient, configurationService, utilityService, uiUpdateManager);

  }


  private setCurrentUser(currentUser: ICurrentUser): void {
    this.currentUser = currentUser;
    this.currentUser.role = this.authService.getUser().profile.role;

    if (!this.currentUser.role || this.currentUser.role.length === 0) {
      const role: any = 'StandardUser';
      this.currentUser.role = [...role];
    }
    this.setIsSubscribedOnce();
    this.setIsFullMember();
  }

  get getCachedCurrentUser() {
    return this.currentUser;
  }

  loadCurrentUser(userId: string): void {
    this.get<ICurrentUser>(userId, '/profile').subscribe(resp => {

      this.setCurrentUser(resp);
      this.onCurrentUserChanged.next(this.currentUser);
    });
  }

  clearCachedUser(): void {
    this.currentUser = null;
    this.onCurrentUserChanged.next(null);
  }


  hasRole(role: string): boolean {
    role = role.toLowerCase();
    if (this.currentUser && this.currentUser.role) {
      if (Array.isArray(this.currentUser.role)) {

        const roles = [...this.currentUser.role];

        return roles.filter(x => x.toLowerCase() === role).length > 0;
      }
      else {
        return this.currentUser.role.toLowerCase() === role;
      }
    }
  }

  setSubscriptionStatus(status: SubscribeStatusEnum) {
    if (this.currentUser) {
      this.currentUser.subscriptionStatus = status;
      this.setIsSubscribedOnce();
    }
  }

  private setIsSubscribedOnce() {
    if (this.utilityService.isUserSubscribedOnce(this.currentUser.subscriptionStatus)) {
      this.currentUser.isSubscribedOnce = true;
    }
    else {
      this.currentUser.isSubscribedOnce = false;
    }
  }

  private setIsFullMember() {
    const strategicPartner = 'StrategicPartner';
    this.currentUser.isFullMember = this.currentUser.role.includes(strategicPartner);
  }

}

export interface ICurrentUser {

  id: string;
  username: string;
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  dateOfBirth: string;
  phoneNumber: string;
  ipAddress: string;
  latitude: string;
  longitude: string;
  isLoggedIn: boolean;
  referralCode: string;
  subscriptionStatus: SubscribeStatusEnum;
  role: any;
  isSubscribedOnce: boolean;
  isFullMember:boolean;
    gamingPlatforms: UserGamePlatform[];
}

