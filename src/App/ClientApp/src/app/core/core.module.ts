import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { OAuthInterceptor } from '@partie/core/interceptors/oauth.interceptor';


@NgModule({
  imports: [
    HttpClientModule,
    CommonModule
  ],
  declarations: [
  ],
  exports: [

  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: OAuthInterceptor,
      multi: true
    }
  ]
})
export class CoreModule { }
