import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs//operators';

//Models
import { MultiSelectListItem } from '@partie/shared/models/multi-select-list-item/multi-select-list-item';
import { UserLanguages } from '@partie/account/models/user-languages';
import { UserRegions } from '@partie/account/models/user-regions';
import { AddOrUpdateUserLanguagesRequest, AddOrUpdateUserLanguagesResponse } from '@partie/account/models/add-or-update-user-languages';
import { AddOrUpdateUserRegionsRequest, AddOrUpdateUserRegionsResponse } from '@partie/account/models/add-or-update-user-regions';

//Service
import { DialogService } from '@partie/shared/services/dialog/dialog.service';
import { AccountService } from '@partie/account/services/account.service';
import { CurrentUserService, ICurrentUser } from '@partie/core/services/current-user.service';


@Component({
  selector: 'partie-account-preferences',
  templateUrl: './account-preferences.component.html',
  styleUrls: ['./account-preferences.component.css']
})
export class AccountPreferencesComponent implements OnInit, OnDestroy {

  languages: MultiSelectListItem[];
  selectedLanguages = '';

  regions: MultiSelectListItem[];
  selectedRegions = '';
  private currentUser: ICurrentUser;

  private teardown$ = new Subject<void>();

  constructor(private readonly dialog: DialogService,
    private readonly accountService: AccountService,
    private readonly currentUserService: CurrentUserService) {
    this.languages = [];
    this.regions = [];
  }

  ngOnInit() {

    this.currentUserService.afterCurrentUserChanged.pipe(takeUntil(this.teardown$))
      .subscribe((currentUser:ICurrentUser) => {
        this.currentUser = currentUser;
        this.getUserLanguages();
        this.getUserRegions();
      });
  }

  private getUserLanguages(): void {
    this.accountService.getUserLanguages(this.currentUser.id)
      .pipe(takeUntil(this.teardown$)).subscribe((resp:UserLanguages) => {
        for (let language of resp.languages) {

          const languageItem = new MultiSelectListItem(language.id,language.name, language.selected);
          this.languages.push(languageItem);
        }
        this.selectedLanguages = this.languages.filter(l => l.isChecked).map(x => x.name).join(', ');
      });
  }

  private getUserRegions(): void {
    this.accountService.getUserRegions(this.currentUser.id)
      .pipe(takeUntil(this.teardown$)).
      subscribe((resp:UserRegions) => {
        for (let region of resp.regions) {

          const regionItem = new MultiSelectListItem(region.id,region.name, region.selected);
          this.regions.push(regionItem);
        }
        this.selectedRegions = this.regions.filter(l => l.isChecked).map(x => x.name).join(', ');
      });
  }

  ngOnDestroy(): void {
    this.teardown$.next();
    this.teardown$.complete();
  }

  openLanguagesMultiSelect() {

    const ref = this.dialog.openMultiSelect('Choose your language', this.languages);

    ref.afterClosed.pipe(takeUntil(this.teardown$)).subscribe(languages => {
      console.log('Language multi select closed', languages);

      this.selectedLanguages = languages as string;

      const request = new AddOrUpdateUserLanguagesRequest();
      request.userId = this.currentUser.id;
      request.languageIds = this.languages.filter(l => l.isChecked).map(item => item.id);
      this.accountService.addOrUpdateUserLanguages(request)
        .pipe(takeUntil(this.teardown$))
        .subscribe(resp => console.log('user languages updated', resp));
    });
  }

  openRegionsMultiSelect() {

    const ref = this.dialog.openMultiSelect('Choose your region', this.regions);

    ref.afterClosed.pipe(takeUntil(this.teardown$)).subscribe(regions => {
      console.log('Region multi select closed', regions);
      this.selectedRegions = regions as string;

      const request = new AddOrUpdateUserRegionsRequest();
      request.userId = this.currentUser.id;
      request.regionIds = this.regions.filter(l => l.isChecked).map(item => item.id);
      this.accountService.addOrUpdateUserRegions(request)
        .pipe(takeUntil(this.teardown$))
        .subscribe(resp => console.log('user regions updated', resp));
    });
  }
}
