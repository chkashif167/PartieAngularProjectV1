import { User, UserManager, UserManagerSettings } from 'oidc-client';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

import { ConfigurationService } from '@partie/shared/services/configuration.service';
import { LocalStorageService } from '@partie/core/services/local-storage.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private manager: any;
  private user: User = null;

  private onUserManagerInitialized = new ReplaySubject(1);

  afterUserManagerInitialized = this.onUserManagerInitialized.asObservable();

  constructor(
    private readonly configurationService: ConfigurationService,
    private readonly localStorageService: LocalStorageService
    ) {

    configurationService.loadConfigurationBehaviorSubject.subscribe(configs => {

      if (configs) {
        const settings = this.configurationService.getAuthSettings;
        this.initialize(settings);
      }
    });
  }

  initialize(userManagerSettings: UserManagerSettings): void {

    this.manager = new UserManager(userManagerSettings);

    this.subscribeEvents();

    this.manager.getUser().then(user => {
      this.user = user;
      this.onUserManagerInitialized.next(this.user);
    });
    
  }

  getClaims(): any {
    if (this.isAuthenticUser()) {
      return this.user.profile;
    }
    return null;
  }

  isLoggedIn(): boolean {

    const isAuthenticUser = this.isAuthenticUser();
    if (isAuthenticUser) {

      if (this.hasNewSocialAccountClaim()) {
        return false;
      }
      return true;
    }
    return false;
  }

  isNewSocialAccountRegistering(): boolean {

    const isAuthenticatedUser = this.isAuthenticUser();
    if (isAuthenticatedUser) {
      return this.hasNewSocialAccountClaim();
    }
    return false;
  }

  private subscribeEvents(): void {

    this.manager.events.addUserLoaded(user => {
      this.user = user;
    });

    this.manager.events.addSilentRenewError(() => {
      console.log('error SilentRenew');
    });

    this.manager.events.addAccessTokenExpiring(() => {
      console.log('access token expiring');
    });

    this.manager.events.addAccessTokenExpired(() => {
      console.log('access token expired');
    });

    
  }

  refreshCallBack(): void {

    console.log('start refresh callback');
    this.manager.signinSilentCallback()
      .then(data => { console.log('success callback') })
      .catch(err => {
        console.log('error callback');
      });
    console.log('end refresh callback');
  }

  getUser(): User {

    if (this.isLoggedIn()) {
      return this.user;
    }
    return null;
  }

  getName(): any {
    return this.user.profile.name;
  }

  getAuthorizationHeaderValue(): string {

    if (this.user && this.user.access_token) {
      return `${this.user.token_type} ${this.user.access_token}`;
    }
    return undefined;
  }

  startAuthentication(includeRedirectUrl = true): Promise<void> {

    const redirectUrl = includeRedirectUrl ? window.location.href : null;
    return this.manager.signinRedirect({ state: redirectUrl });
  }


  logout(): Promise<void> {
    return this.manager.signoutRedirect();
  }

  completeAuthentication(): Promise<void> {

    return this.manager.signinRedirectCallback().then(user => {
      console.log(user);
      this.user = user;
      window.history.replaceState({}, window.document.title, window.location.origin + window.location.pathname);
      window.location = user.state || '/';
    });
  }

  private isAuthenticUser(): boolean {

    
    const settings = this.configurationService.getAuthSettings;
    const key = `oidc.user:${settings.authority}:${settings.client_id}`;

    const  userObject = this.localStorageService.getItem(key, true);

    //TODO: this is a temporary solution need to fix it.

    return userObject != null && this.user != null && !this.user.expired;
  }

  private hasNewSocialAccountClaim(): boolean {
    const claims = this.getClaims();
    const newSocialAccountClaim = claims.new_social_account;
    return newSocialAccountClaim && newSocialAccountClaim === '1';
  }
}
