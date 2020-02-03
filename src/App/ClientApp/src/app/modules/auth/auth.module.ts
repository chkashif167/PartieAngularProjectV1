import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SharedModule } from '@partie/shared/shared.module';

import { CallbackComponent } from '@partie/auth/components/callback.component';

export const routes = [
  { path: '', component: CallbackComponent }
];

@NgModule({
  declarations: [CallbackComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  providers: [
  ]
})
export class AuthModule { }
