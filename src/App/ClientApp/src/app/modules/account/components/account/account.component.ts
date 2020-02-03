import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CurrentUserService, ICurrentUser } from '@partie/core/services/current-user.service';
import { CopyService } from '@partie/core/services/copy.service';
import { ConfigurationService } from '@partie/shared/services/configuration.service';
import { AccountService } from '@partie/account/services/account.service';
import { Profile } from '@partie/profile/models/profile.model';
import { ProfileService } from '@partie/modules/profile/services/profile.service';


@Component({
    selector: 'partie-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit, OnDestroy {

    userId: string = '';
    roles: any[];
    referralCode: string = '';


    @ViewChild('copyLink') copyLink;

    termsIsActive: boolean = false;
    private teardown$ = new Subject<void>();

    constructor(private readonly router: Router,
        private readonly currentUserService: CurrentUserService,
        private readonly copyService: CopyService,
        private readonly accountService: AccountService,
        private readonly configService: ConfigurationService,
        /*private readonly profileService: ProfileService*/) { }

    ngOnInit() {

        this.currentUserService.afterCurrentUserChanged.pipe(takeUntil(this.teardown$))
            .subscribe((currentUser: ICurrentUser) => {
                this.userId = currentUser.id;
                this.roles = [...currentUser.role];
                this.referralCode = `${this.configService.applicationUrl}/referral/${currentUser.referralCode}`;
            });
    }

    navigateByUrl(url: string) {
        this.router.navigateByUrl(url);
    }

    copyText(event) {
        let textContent = event.srcElement.innerHTML;
        if (textContent === 'Copied') {
            return;
        }
        this.copyService.toClipboard(this.copyLink.nativeElement);
        event.srcElement.innerHTML = 'Copied';

        timer(5000).subscribe(val => {
            event.srcElement.innerHTML = 'Copy';
        });
    }

    ngOnDestroy(): void {

        this.teardown$.next();
        this.teardown$.complete();
    }

    openTermsPopup() {
        this.termsIsActive = true;


    }

    closeTermsModal($event) {
        this.termsIsActive = false;
    }

    

}
