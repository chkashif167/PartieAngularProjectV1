import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//Modules
import { AccountRoutingModule } from '@partie/account/account-routing.module';
import { ThemeModule } from '@partie/theme/theme.module';
import { SharedModule } from '@partie/shared/shared.module';

//Components
import { AccountPreferencesComponent } from '@partie/account/components/account-preferences/account-preferences.component';
import { PrivacyAndSafetyComponent } from '@partie/account/components/privacy-and-safety/privacy-and-safety.component';
import { AccountComponent } from '@partie/account/components/account/account.component';
import { PartnerProgressComponent } from '@partie/account/components/partner-progress/partner-progress.component';


//Service
import { AccountService } from '@partie/account/services/account.service';
import { EarningTrackerComponent } from './components/earning-tracker/earning-tracker.component';





@NgModule({
  declarations: [
    AccountPreferencesComponent,
    PrivacyAndSafetyComponent,
    AccountComponent,
    PartnerProgressComponent,
    EarningTrackerComponent
  ],
  imports: [
    CommonModule,
    AccountRoutingModule,
    ThemeModule,
      SharedModule,
  ],
  providers: [
    AccountService
    ]
})
export class AccountModule { }
