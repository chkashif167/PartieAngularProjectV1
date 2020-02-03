import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgxCaptchaModule } from 'ngx-captcha';

//Components
import { RegisterComponent } from '@partie/register/components/register.component';

//Services
import { RegisterService } from '@partie/register/services/register.service';
import { GeolocationService } from '@partie/register/services/geolocation.service';

//Directive
import { AgeLimitValidator } from '@partie/shared/validators/ageLimit.validator';
import { EqualValidator } from '@partie/shared/validators/equal.validator';
import { DuplicateValueValidatorDirective } from '@partie/shared/validators/duplicate-value.validator';


//Modules
import { VendorModule } from '@partie/vendor/vendor.module';
import { SharedModule } from '@partie/shared/shared.module';
import { ThemeModule } from '@partie/modules/theme/theme.module'


export const routes = [
  { path: '', component: RegisterComponent, pathMatch: 'full' }
];


@NgModule({
  declarations: [
    RegisterComponent,
    AgeLimitValidator,
    DuplicateValueValidatorDirective
  ],
  imports: [
    FormsModule,
    CommonModule,
    NgxCaptchaModule,
    VendorModule,
    SharedModule,
    ThemeModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    DuplicateValueValidatorDirective,
    AgeLimitValidator
  ],
  providers: [
    RegisterService,
    GeolocationService
  ]
})
export class RegisterModule { }
