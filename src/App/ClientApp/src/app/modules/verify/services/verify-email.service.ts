import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs//operators';

import { ApiBaseService } from '@partie/shared/services/api-base.service';
import { BaseResponse } from "@partie/register/models/user.model";



@Injectable()
export class VerifyEmailService extends ApiBaseService {

  verify(code: string): Observable<boolean> {

    return this.get(null, `/profile/verify/email?code=${code}`).pipe(map((resp:any) => resp.verified as boolean));
  }

  resendCode(email: string): Observable<boolean> {
    return this.post({ Email: email }, '/profile/code/email/resend').pipe(map((resp: BaseResponse)=> resp.hasError ));
  }
}
