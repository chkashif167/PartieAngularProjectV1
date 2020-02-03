import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';

//Services
import { PhoneNumberService } from '@partie/verify/services/phone-number.service';
import { AuthService } from '@partie/core/services/auth.service';
import { RouteUtilityService } from '@partie/shared/services/route-utility.service';

//Models
import { VerifyPhoneNumber } from '@partie/verify/models/verify-phone-number.model';
import { MaskedPhoneNumber } from '@partie/verify/models/masked-phone-number.model';
import { BaseResponse } from '@partie/register/models/user.model';



@Component({
  selector: 'partie-verfiy-phone',
  templateUrl: './verify-phone.component.html',
  styleUrls: ['./verify-phone.component.css']
})
export class VerifyPhoneComponent implements OnInit, OnDestroy {

  formattedPhoneNumber: string;
  phoneNumber: MaskedPhoneNumber;
  code: string;
  errMsg: string;
  message: string;

  private teardown$ = new Subject<void>();

  constructor(private readonly phoneNumberService: PhoneNumberService,
    private readonly authService: AuthService,
    private readonly routeService: RouteUtilityService) {

    this.formattedPhoneNumber = '';
    this.code = '';
    this.message = '';
  }

  ngOnInit(): void {
    let userId;
    let phoneNotVerified;

    if (this.authService.getClaims()) {
      userId = this.authService.getClaims().sub;
      phoneNotVerified = this.authService.getClaims().PhoneNotVerified;
    }

    if (userId === undefined) {
      //If no user id found redirect user to login page.
      this.authService.startAuthentication();
    }
    if (phoneNotVerified) {
      this.resendPhoneVerificationCode();
    }
    else {
      this.routeService.navigateToUrl("/");
    }
    

      this.phoneNumberService.load(userId)
      .pipe(takeUntil(this.teardown$))
      .subscribe((resp: MaskedPhoneNumber) => {

        this.phoneNumber = resp;
        this.formattedPhoneNumber = this.phoneNumber.maskedPhoneNumber;
        this.message = `We just sent a verification code to ${this.formattedPhoneNumber}`;
      });
  }

  onSubmit(): void {

    if (this.code && this.phoneNumber) {

      const model = new VerifyPhoneNumber();
      model.userId = this.phoneNumber.id;
      model.phoneVerificationCode = this.code;

      this.errMsg = '';

      this.phoneNumberService.verify(model).pipe(takeUntil(this.teardown$))
        .subscribe((resp: BaseResponse) => {
          if (resp.hasError) {
            this.errMsg = 'Invalid Code. Please enter correct code and try again.';
          } else {

            this.authService.startAuthentication(false);
          }

        });
    }
  }

  resendPhoneVerificationCode(): void {

    

    const userId = this.authService.getClaims().sub;
    this.phoneNumberService.resendVerificationCode(userId)
      .pipe(takeUntil(this.teardown$))
      .subscribe(() => {
        this.message =  `We just sent a verification code to ${this.formattedPhoneNumber}`;
      }, (error) => {

        this.message = `Something went wrong cannot resend verification code to ${this.formattedPhoneNumber}. ${error.statusCode}`;
      });
  }

  ngOnDestroy(): void {

    this.teardown$.next();
    this.teardown$.complete();
  }
}
