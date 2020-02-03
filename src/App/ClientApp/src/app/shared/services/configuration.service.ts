import { Injectable, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserManagerSettings, WebStorageStateStore } from 'oidc-client';
import { BehaviorSubject, Observable } from 'rxjs';



@Injectable()
export class ConfigurationService {

  private configuration: IServerConfiguration;
  private serverSetting: any = {}

  loadConfigurationBehaviorSubject = new BehaviorSubject(null);

  constructor(private readonly http: HttpClient) { }

  public getJSON(): Observable<any> {
    let fileUrl = 'assets/settings/';
    fileUrl += isDevMode() ? 'appsettingslocal.json' : 'appsettingsLive.json';
    return this.http.get(fileUrl);
  }

  loadConfig() {

    //isDevMode() ? this.loadConfigLocal() : this.loadConfigLive();
    return this.http.get<IServerConfiguration>('/api/Configuration/ConfigurationData')
      .toPromise()
      .then(result => {
        this.configuration = <IServerConfiguration>(result);
        this.loadConfigurationBehaviorSubject.next('Configuration loaded!');
      }, error => {
        console.error(error);
      });

  }

  loadConfigLocal(): void {

    let serverSettings = {}

    this.getJSON().subscribe(result => {
      serverSettings = {
        applicationUrl: result.WebAppUrl,
        gatewayApiUrl: result.GatewayApiUrl,
        authServerUrl: result.Auth.AuthServerUrl,
        ageLimit: result.AgeLimit,
        captchaSiteKey: result.Recaptcha.SiteKey,
        cdnBaseUrl: result.CdnBaseUrl,
        chatApiUrl: result.ChatApiUrl,
      };

      this.configuration = serverSettings as IServerConfiguration;
      this.loadConfigurationBehaviorSubject.next('Configuration loaded!');

    });
  }

  loadConfigLive(): void {

    this.http.get<IServerConfiguration>('/api/Configuration/ConfigurationData')
      .toPromise()
      .then(result => {
        this.configuration = ((result) as IServerConfiguration);
        this.loadConfigurationBehaviorSubject.next('Configuration loaded!');
      }, error => {
        console.error(error);
      });
  }

  get applicationUrl() {
    return this.configuration.applicationUrl;
  }

  get gatewayApiUrl() {
    return this.configuration.gatewayApiUrl;
  }

  get authServerUrl() {
    return this.configuration.authServerUrl;
  }

  get getAgeLimit() {
    return this.configuration.ageLimit;
  }

  get getCaptchaSiteKey() {
    return this.configuration.captchaSiteKey;
  }

  get getAuthSettings(): UserManagerSettings {
    return this.authSettingObject();
  }

  get getFacebookAuthSettings(): UserManagerSettings {
    return this.authSettingObject("idp:Facebook");
  }

  get getCdnBaseUrl() {
    return this.configuration.cdnBaseUrl;
  }
  get chatApiUrl() {
    return this.configuration.chatApiUrl;
  }

  get commApiUrl() {
    return this.configuration.commApiUrl;
  }

  private authSettingObject(acrvalues: string = ''): any {
    return {

      authority: this.authServerUrl,
      client_id: 'partie.webapp.client',
      redirect_uri: this.applicationUrl + '/auth-callback',
      post_logout_redirect_uri: this.applicationUrl,
      response_type: 'id_token token',
      scope: 'openid gateway_api profile',
      loadUserInfo: true,
      automaticSilentRenew: true,
      acr_values: acrvalues,
      userStore: new WebStorageStateStore({ store: window.localStorage }),

      metadata: {
        issuer: this.authServerUrl,
        authorization_endpoint: this.authServerUrl + '/connect/authorize',
        token_endpoint: this.authServerUrl + '/connect/token',
        jwks_uri: this.authServerUrl + '/.well-known/openid-configuration/jwks',
        userinfo_endpoint: this.authServerUrl + '/connect/userinfo',
        end_session_endpoint: this.authServerUrl +'/connect/endsession'
      }
    };
  }

}

export interface IServerConfiguration {
  applicationUrl: string;
  gatewayApiUrl: string;
  authServerUrl: string;
  ageLimit: string;
  captchaSiteKey: string;
  cdnBaseUrl: string;
  chatApiUrl: string;
  commApiUrl:string;
}
