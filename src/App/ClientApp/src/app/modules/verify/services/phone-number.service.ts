import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

import { ApiBaseService } from '@partie/shared/services/api-base.service';

//Models
import { VerifyPhoneNumber } from '@partie/verify/models/verify-phone-number.model';
import { MaskedPhoneNumber } from '@partie/verify/models/masked-phone-number.model';
import { BaseResponse } from '@partie/register/models/user.model';
import { ResendPhoneVerificationCode } from '@partie/verify/models/resend-phone-verification-code.model';



@Injectable()
export class PhoneNumberService extends ApiBaseService {

  load(userId: string): Observable<MaskedPhoneNumber> {

    return this.get<MaskedPhoneNumber>(userId, '/profile/maskedPhone');
  }

  verify(verifyPhoneNumber: VerifyPhoneNumber): Observable<BaseResponse> {

    return this.post<VerifyPhoneNumber, BaseResponse>(verifyPhoneNumber, '/profile/verify/phone');
  }

  resendVerificationCode(userId: string): Observable<ResendPhoneVerificationCode> {
    return this.post<any, ResendPhoneVerificationCode>({id:userId}, '/profile/code/phone/resend');
  }
}
