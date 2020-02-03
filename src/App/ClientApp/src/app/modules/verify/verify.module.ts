import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';


//Moudules
import { SharedModule } from '@partie/shared/shared.module';

//Services
import { PhoneNumberService } from '@partie/verify/services/phone-number.service';
import { VerifyEmailService } from '@partie/verify/services/verify-email.service';


//Components
import { VerifyEmailComponent } from '@partie/verify/components/verify-email/verify-email.component';
import { VerifyPhoneComponent } from '@partie/verify/components/verify-phone/verify-phone.component';

export const routes = [
  { path: 'phone', component: VerifyPhoneComponent, pathMatch: 'full' },
  { path: 'email', component: VerifyEmailComponent, pathMatch: 'full' }
];


@NgModule({
  declarations: [
    VerifyPhoneComponent,
    VerifyEmailComponent,
    VerifyPhoneComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  providers: [
    PhoneNumberService,
    VerifyEmailService
  ]
})
export class VerifyModule { }
