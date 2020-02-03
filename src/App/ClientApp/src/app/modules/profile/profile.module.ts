
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

//Modules
import { RegisterModule } from '@partie/register/register.module';
import { ProfileRoutingModule } from '@partie/profile/profile-routing.module';
import { ThemeModule } from '@partie/theme/theme.module';
import { DirectiveModule } from '@partie/directive/directive.module';
import { VendorModule } from '@partie/vendor/vendor.module';
import { SharedModule } from '@partie/shared/shared.module';
import { VerifyModule } from '@partie/verify/verify.module';
import { AccountModule } from '@partie/modules/account/account.module'

//Components
import { PublicProfileComponent } from '@partie/profile/components/public-profile/public-profile.component';
import { EditProfileComponent } from '@partie/profile/components/edit-profile/edit-profile.component';
import { PartieListComponent } from '@partie/profile/components/partie-list/partie-list.component';

//Services
import { ProfileService } from '@partie/profile/services/profile.service';
import { BarChartComponent} from '@partie/modules/profile/components/bar-chart/bar-chart.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';

import { EqualValidator } from '../../shared/validators/equal.validator';


@NgModule({
    declarations: [PublicProfileComponent, EditProfileComponent, PartieListComponent, BarChartComponent, ChangePasswordComponent],
  imports: [
    FormsModule,
    CommonModule,
    ProfileRoutingModule,
    RegisterModule,
    ThemeModule,
    VendorModule,
    DirectiveModule,
    SharedModule,
    VerifyModule,
      AccountModule
   
  ],
  providers: [ProfileService],
  entryComponents: [PartieListComponent]
})
export class ProfileModule { }
