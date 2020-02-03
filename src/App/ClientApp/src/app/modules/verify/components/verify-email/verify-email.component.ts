import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs//operators';

import { RegularExpConstants } from '@partie/core/constants/regexp.constants';


//Services
import { VerifyEmailService } from '@partie/verify/services/verify-email.service';
import { CurrentUserService, ICurrentUser } from '@partie/core/services/current-user.service';

@Component({
  selector: 'partie-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent implements OnInit, OnDestroy {

  code:string;
  emailVerified: boolean;
  resendVerificationCode: boolean;
  email: string;
  notificationMsg: string;
  successMsg:string;
  private teardown$ = new Subject<void>();

  currentUserLoggedIn:boolean;

  emailPattern = RegularExpConstants.emailPattern;

  constructor(private readonly verifyEmailService: VerifyEmailService,
    private readonly currentUserService: CurrentUserService,
    private readonly route: ActivatedRoute,
    private router: Router,
    ) {
    this.emailVerified = false;
    this.resendVerificationCode = false;
    this.email = '';
    this.notificationMsg = '';
    this.successMsg = '';
    this.currentUserLoggedIn = false;
  }

  ngOnInit() {

    this.currentUserService.afterCurrentUserChanged
      .pipe(takeUntil(this.teardown$))
      .subscribe((resp:ICurrentUser)=>{
        this.currentUserLoggedIn = resp.isLoggedIn;
        
        
      })

     this.route.queryParams
    .pipe(takeUntil(this.teardown$))
      .subscribe(params => {
       this.code = params['code'];
        if(this.code) this.onSubmit();
    });

    
  }

  onSubmit(): void {
    if (this.code) {

      this.verifyEmailService.verify(this.code).pipe(takeUntil(this.teardown$))
        .subscribe((resp: boolean) => {
          this.emailVerified = resp;

          if (!this.emailVerified) {
            this.code = '';
            this.resendVerificationCode = true;
            this.notificationMsg = 'Invalid code. Please enter your email below and click Resend Verification Email.';
          }
          else {
            this.router.navigate(['/']);
          }

        });
    }

  }

  onSendVerificationEmail(): void {
    this.notificationMsg = '';
    this.verifyEmailService.resendCode(this.email).pipe(takeUntil(this.teardown$))
      .subscribe((resp: boolean) => {
        if (resp) {
          this.resendVerificationCode = false;
          this.successMsg = 'We have sent an email with a confirmation link to your email address. Please allow 5-10 minutes for this message to arrive.';
        } else {
          this.notificationMsg = `${this.email} is not registered with us.`;
        }

      });
  }

  ngOnDestroy(): void {

    this.teardown$.next();
    this.teardown$.complete();
  }

}
