import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject, combineLatest } from 'rxjs';
import { takeUntil, switchMap } from 'rxjs/operators';


//Models
import { EditProfile, EditProfileResponse, SocialMediaAccounts } from '@partie/profile/models/edit-profile.model';
import { MultiSelectListItem } from '@partie/shared/models/multi-select-list-item/multi-select-list-item';


//Services
import { ProfileService } from '@partie/profile/services/profile.service';
import { DialogService } from '@partie/shared/services/dialog/dialog.service';
import { FileService } from '@partie/core/services/file.service';
import { CurrentUserService, ICurrentUser } from '@partie/core/services/current-user.service';
import { RegularExpConstants } from '@partie/core/constants/regexp.constants';
import { AuthService } from '@partie/core/services/auth.service';
import { VerifyEmailService } from '@partie/verify/services/verify-email.service';
import { PartieToastrService } from '@partie/core/services/partie-toastr.service';
import { UserGamePlatform } from '../../../game/models/game.model';



@Component({
    selector: 'partie-edit-profile',
    templateUrl: './edit-profile.component.html',
    styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit, OnDestroy {

    user: EditProfile;
    private teardown$ = new Subject<void>();

    gamingPlatforms: string[];
    userGamingPlatforms: MultiSelectListItem[];
    selectedGamingPlatforms = '';
    currentUser: ICurrentUser;

    @ViewChild('fileInput')
    fileInput: ElementRef;
    fileUploadPercent: number;
    hasSocialMediaAccount:boolean;

    avatarImage: File = null;
    emailPattern = RegularExpConstants.emailPattern;

    constructor(
        private readonly router: Router,
        private readonly profileService: ProfileService,
        private readonly dialog: DialogService,
        private readonly currentUserService: CurrentUserService,
        private readonly fileService: FileService,
        private readonly authService: AuthService,
        private readonly verifyEmailService: VerifyEmailService,
        private readonly toastrService: PartieToastrService) {

        this.user = new EditProfile();
        this.gamingPlatforms = ['Playstation', 'Xbox', 'Steam', 'Uplay', 'Epic', 'Mobile', 'Switch', 'PC'];

    }

    ngOnInit() {

        this.fileUploadPercent = 0;

        this.currentUserService.afterCurrentUserChanged
            .pipe(takeUntil(this.teardown$))
            .pipe(switchMap((u: ICurrentUser) => {
                this.currentUser = u;
                return this.profileService.getProfile(u.id);

            }))
            .subscribe((resp: any) => {
                this.user = resp as EditProfile;
                this.buildRankString(this.user.rankWorldwide || '', this.user.rankCountrywide || '');
                this.buildUserGamingPlatforms();
                this.linkSocialMediaAccount();
            });
    }


    private buildRankString(worldwideRank: string, counrywideRank: string): void {
        this.user.rankCombined = `${this.parseRanking(worldwideRank)}${this.parseRanking(counrywideRank)}`;
    }

    private parseRanking(rank: string): string {
        const minLength = 3;
        const repeatStr = "0";
        return `${repeatStr.repeat(minLength - rank.length)}${rank}`;
    }

    private buildUserGamingPlatforms(): void {
        this.userGamingPlatforms = [];

        this.gamingPlatforms.forEach(platform => {

            const item = new MultiSelectListItem();
            item.name = platform;
            item.isChecked = this.user.gamingPlatforms.filter(x => x.gamingPlatform === platform).length > 0;
            this.userGamingPlatforms.push(item);
        });

        this.selectedGamingPlatforms = this.user.gamingPlatforms.map(x=>x.gamingPlatform).join(', ');
    }

   
   
    openGamingPlatformMultiSelect(): void {

        const dlg = this.dialog.openMultiSelect('Select Your Platforms', this.userGamingPlatforms);

        dlg.afterClosed.pipe(takeUntil(this.teardown$)).subscribe((gp: UserGamePlatform[]) => {

            this.user.gamingPlatforms = gp;
            this.selectedGamingPlatforms = gp.map(x=>x.gamingPlatform).join(',');
        });
    }


    onSubmit(): void {

        let avatarImgChanged: boolean = false;

        this.user.rankWorldwide = this.user.rankCombined.slice(0, 3);
        this.user.rankCountrywide = this.user.rankCombined.slice(3, 6);


        if (this.avatarImage && this.avatarImage.size > 0) {
            avatarImgChanged = true;
        }

        const profileUpdate$ = this.profileService.update(this.user);


        if (avatarImgChanged) {

            const avatarImg$ = this.fileService.uploadProfileAvatar('avatarImg', this.avatarImage);

            combineLatest(profileUpdate$, avatarImg$, (profile: EditProfileResponse, imgUploadResponse: HttpEvent<any>) => ({ profile, imgUploadResponse }))
                .pipe(takeUntil(this.teardown$))
                .subscribe((result: any) => {

                    if (result.imgUploadResponse.type === HttpEventType.Response) {
                        this.fileService.burstAvatarImgCache();
                        this.handleProfileUpdate(result.profile as EditProfileResponse);
                    }
                });

        } else {
            profileUpdate$.pipe(takeUntil(this.teardown$))
                .subscribe((resp: EditProfileResponse) => {
                    this.handleProfileUpdate(resp);
                });
        }

    }

    private handleProfileUpdate(resp: EditProfileResponse): void {

        if (resp.isPhoneNumberChanged) {
            this.authService.logout();
        } else {
            this.currentUser.displayName = this.user.displayName;

            this.redirectToProfile();
        }
    }


    private redirectToProfile(): void {
        this.router.navigateByUrl(`/profile/${this.user.id}`);
    }


    openFileDialog(): void {
        this.fileInput.nativeElement.click();
    }


    handleFileInput(files: FileList): void {

        if (files && files.item(0)) {
            this.avatarImage = files.item(0);
        }
    }

    verifyEmail(): void {

        if (this.user.email == undefined || this.user.email.trim() == '') return;

        this.verifyEmailService.resendCode(this.user.email)
            .pipe(takeUntil(this.teardown$))
            .subscribe((resp: boolean) => {
                if (resp) {
                    this.router.navigateByUrl('/verify/email');
                } else {
                    const msg = `${this.user.email} is not registered with us.`;
                    this.toastrService.error(msg, 'Email Verification');
                }
            });
    }

    linkSocialMediaAccount() {
                this.profileService.userSocialMediaAccountExists(SocialMediaAccounts.Facebook.toString())
                .pipe(takeUntil(this.teardown$))
                    .subscribe((resp: boolean) => {
                  this.hasSocialMediaAccount = resp;
                  this.user.linkedSocialAccountUserName = this.user.email;
                });
        
    }

    unLinkAccount() {
        this.profileService.unLinkSocialMediaAccount(SocialMediaAccounts.Facebook.toString())
        .pipe(takeUntil(this.teardown$))
          .subscribe((resp: boolean) => {
              if (resp) {
                  this.hasSocialMediaAccount = false;
                  this.toastrService.success("Your social media account has successfully unlinked");

              }
        });
    }

    ngOnDestroy(): void {
        this.teardown$.next();
        this.teardown$.complete();

    }

}
