import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs//operators';

declare var require: any;
let calculatePasswordStrength = require('zxcvbn');

//Models
import { User } from '@partie/register/models/user.model';
import { Position } from '@partie/register/models/position.model';
import { Captcha } from '@partie/shared/models/captcha.model'

//Services
import { RegisterService } from '@partie/register/services/register.service';
import { GeolocationService } from '@partie/register/services/geolocation.service';
import { ConfigurationService } from '@partie/shared/services/configuration.service';
import { AuthService } from '@partie/core/services/auth.service';
import { RegularExpConstants } from '@partie/core/constants/regexp.constants';
import { LocalStorageService, StorageKeys } from '@partie/core/services/local-storage.service';


//Components
import { InvisibleReCaptchaComponent } from 'ngx-captcha';


@Component({
  selector: 'partie-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {

  user: User;
  passwordRegex = RegularExpConstants.passwordRegex;
  referralCode: string;
  //captcha starts
  captcha: Captcha;
  @ViewChild('profileCaptchaElem') profileCaptchaElem: InvisibleReCaptchaComponent;
  timeEllapsed: any;
  //captcha ends

  private teardown$ = new Subject<void>();
  emailPattern = RegularExpConstants.emailPattern;

  constructor(private readonly registrationService: RegisterService,
    private readonly locationService: GeolocationService,
    private readonly cdr: ChangeDetectorRef,
    private readonly config: ConfigurationService,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly localStorageService: LocalStorageService) {

    this.user = new User();
    this.captcha = new Captcha();
  }

  ngOnInit() {

    this.captcha.siteKey = this.config.getCaptchaSiteKey;
    this.cdr.detectChanges();
    this.updateUserIpAndLocation();
    this.pouplateSocialAccountUserIfAny();

    this.referralCode = this.localStorageService.getItem(StorageKeys.refCode, false);
    console.log('referral Code:', this.referralCode);
  }

  ngAfterViewInit(): void {
    this.captcha.captchaIsLoaded = true;
    this.cdr.detectChanges();
  }

  getCaptchaResponse(): void {
    this.profileCaptchaElem.execute();
  }

  handleSuccess(captchaResponse: string): void {
    this.user.captchaSuccess = true;
    this.user.captchaResponse = captchaResponse;
    this.timeEllapsed = new Date();
    this.cdr.detectChanges();

    //post to server
    this.postRequest();
  }

  passwordStrengthCalculator() {

    const password = document.querySelector("input[type='password']");
    const meter = document.querySelector(".password-meter");

    const val = (password as HTMLInputElement).value;
    const result = calculatePasswordStrength(val);

    if (val === '') {
      meter.setAttribute("data-password-strength", '');
    } else {
      meter.setAttribute("data-password-strength", result.score.toString());
    }
  }

  onSubmit() {
    this.getCaptchaResponse();
  }

  ngOnDestroy(): void {
    this.teardown$.next();
    this.teardown$.complete();
  }

  private postRequest(): void {

    this.user.dateOfBirth = this.registrationService.getValidDateFormat(this.user.dateOfBirth);
      this.user.referralCode = this.referralCode;
      this.user.betaUser = false;
      this.user.emailVerifiedForBetaUser = false;


    this.registrationService.register(this.user)
      .pipe(takeUntil(this.teardown$))
      .subscribe((resp: User) => {
        //remove referral code
        if (this.referralCode) { this.localStorageService.removeItem(StorageKeys.refCode); }
        this.router.navigateByUrl("/");
        
      },
        (e) => {

          console.log('Failed :', e);
        });
  }

  private updateUserIpAndLocation(): void {

    //Update user location
    this.locationService.getLocation()
      .pipe(takeUntil(this.teardown$))
      .subscribe((pos: Position) => {
        if (pos.latitude !== "0" && pos.longitude !== "0") {
          this.user.latitude = pos.latitude;
          this.user.longitude = pos.longitude;
        };
      });

    //update ip
    this.locationService.getIpAddress()
      .pipe(takeUntil(this.teardown$))
      .subscribe((resp: string) => {
        this.user.ipAddress = resp;
      });

  }

  private pouplateSocialAccountUserIfAny(): void {

    if (!this.authService.isNewSocialAccountRegistering()) {
      return;
    }

    const claims = this.authService.getClaims();
    const user = new User();
    user.id = claims.sub;
    user.email = claims.email;

    if (claims.given_name) {

      const names = claims.given_name.split(' ');

      if (names && names.length === 1) {
        user.firstName = names[0];
      }
      else if (names && names.length > 1) {
        user.firstName = names[0];
        user.lastName = names[names.length - 1];
      }
    }
      this.user = user;
  }
}
