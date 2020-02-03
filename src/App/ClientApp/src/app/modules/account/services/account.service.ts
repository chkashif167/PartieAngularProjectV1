import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

//Services
import { ApiBaseService } from "@partie/shared/services/api-base.service";

//models
import { UserLanguages } from "@partie/account/models/user-languages";
import { UserRegions } from "@partie/account/models/user-regions";
import {
  AddOrUpdateUserLanguagesRequest,
  AddOrUpdateUserLanguagesResponse
} from "../models/add-or-update-user-languages";
import {
  AddOrUpdateUserRegionsRequest,
  AddOrUpdateUserRegionsResponse
} from "../models/add-or-update-user-regions";

import { PartnerProgress } from "../models/partner-progress";
import { UserSettings } from '@partie/account/models/user-settings.models.ts';


@Injectable()
export class AccountService extends ApiBaseService {
  getUserLanguages(userId: string): Observable<UserLanguages> {
    return this.get<UserLanguages>(null, `/profile/languages`);
  }

  addOrUpdateUserLanguages(
    request: AddOrUpdateUserLanguagesRequest
  ): Observable<AddOrUpdateUserLanguagesResponse> {
    return this.post<
      AddOrUpdateUserLanguagesRequest,
      AddOrUpdateUserLanguagesResponse
    >(request, `/profile/languages`);
  }

  getUserRegions(userId: string): Observable<UserRegions> {
    return this.get<UserRegions>(null, `/profile/regions`);
  }

  getPartnerProgress(): Observable<PartnerProgress[]> {
    return this.get<PartnerProgress[]>(null, '/Partner/AchievementsProgress');
  }

  addOrUpdateUserRegions(
    request: AddOrUpdateUserRegionsRequest
  ): Observable<AddOrUpdateUserRegionsResponse> {
    return this.post<
      AddOrUpdateUserRegionsRequest,
      AddOrUpdateUserRegionsResponse
    >(request, `/profile/regions`);
  }


  updateUserSettingsInFeedComponent(settings: UserSettings): Observable<UserSettings> {
    return this.post(settings, '/feedSettings/updateUserSettings');
  }

    getUserSettingFromFeedComponent(userId: string): Observable<UserSettings> {
      const url = userId == undefined
        ? '/feedSettings/getUserSettings'
        : `/feedSettings/getUserSettings?userId=${userId}`;
      return this.get<UserSettings>(null, url);
    }

    getUserEarnedAmount(userId: string): Observable<any> {
        return this.get<any>(null, `/payment/getUserEarnedAmount/${userId}`);
    }
  
}
