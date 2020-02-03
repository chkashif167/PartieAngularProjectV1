import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiBaseService } from '@partie/shared/services/api-base.service';

import { User, ValidateUsernameResponse, ValidateEmailResponse, ValidatePhoneNumberResponse, ValidateDisplayNameResponse } from '../models/user.model';

@Injectable()
export class RegisterService extends ApiBaseService {

    register(model: User): Observable<User> {

        return this.post<User, User>(model, '/profile');
    }

    validateUsername(username: string): Observable<ValidateUsernameResponse> {

        return this.post<any, ValidateUsernameResponse>({ username: username }, '/profile/validateusername', false);
    }

    validateEmail(email: string): Observable<ValidateEmailResponse> {

        return this.post<any, ValidateEmailResponse>({ email: email }, '/profile/validateemail', false);
    }

    validatePhoneNumber(phoneNumber: string): Observable<ValidatePhoneNumberResponse> {

        return this.post<any, ValidatePhoneNumberResponse>({ phoneNumber: phoneNumber }, '/profile/validatephonenumber', false);
    }

    validateDisplayName(displayName: string): Observable<ValidateDisplayNameResponse> {

        return this.post<any, ValidatePhoneNumberResponse>({ displayName: displayName }, '/profile/validatedisplayname', false);

    }

    getValidDateFormat(monthYearDate: string): string {

        if (monthYearDate.length !== 6) {
            return null;
        }
        const month = monthYearDate.substring(0, 2);
        if (month < '01' || month > '12') {
            return null;
        }
        const year = monthYearDate.substring(2, 6);
        return `${month}/1/${year}`;
    }
}
