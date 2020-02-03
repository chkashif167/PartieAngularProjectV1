import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

//Services
import { ApiBaseService } from '@partie/shared/services/api-base.service';


//Models
import { Profile } from '@partie/profile/models/profile.model';
import { ReportUser } from '@partie/modules/profile/models/report-user.model';
import { EditProfile } from '@partie/profile/models/edit-profile.model';
import { ChangePassword } from '../models/change-password';


@Injectable()
export class ProfileService extends ApiBaseService {


    getUser(userId: string): Observable<EditProfile> {
        return this.get<EditProfile>(userId, '/profile');
    }

    update(model: EditProfile): Observable<EditProfile> {
        return this.post<any, any>(model, '/profile/update');
    }

    getProfile(userId: string): Observable<Profile> {
        return this.get<Profile>(userId, `/profile`);
    }

    reportUser(model: ReportUser): Observable<ReportUser> {
        return this.post<any, any>(model, '/profile/report');
    }

    userSocialMediaAccountExists(socialSite: string): Observable<boolean> {
        return this.get<boolean>(null, `/profile/socialLoginExists/${socialSite}`);
    }

    unLinkSocialMediaAccount(loginProvider: string): Observable<boolean> {
        return this.get<boolean>(null, `/profile/unlinkSocialAccount/${loginProvider}`);
    }

    changePassword(model: ChangePassword): Observable<any> {
        return this.post<any, any>(model, `/profile/changePassword`);
    }

}


