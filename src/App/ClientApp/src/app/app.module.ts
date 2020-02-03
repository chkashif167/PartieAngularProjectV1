//Third Parties
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { NgModule, APP_INITIALIZER } from '@angular/core';

//Components
import { AppComponent } from './app.component';

//Services
import { AuthService } from '@partie/core/services/auth.service';
import { ApiBaseService } from '@partie/shared/services/api-base.service';
import { ConfigurationService, } from '@partie/shared/services/configuration.service';
import { WindowWrapperService } from '@partie/core/services/window-wrapper.service';
import { LocalStorageService } from '@partie/core/services/local-storage.service';


//Modules
import { CoreModule } from '@partie/core/core.module';
import { AppRoutingModule } from '@partie/app-routing.module';
import { VendorModule } from '@partie/vendor/vendor.module';
import { SharedModule } from '@partie/shared/shared.module';

//Functions
const appConfigInitializerFn = (appConfig: ConfigurationService) => {
  return () => {
    return appConfig.loadConfig();
  };
};

@NgModule({
  declarations: [
    AppComponent
   

   

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    AppRoutingModule,
    VendorModule,
    SharedModule
  ],
  providers: [
    AuthService,
    ApiBaseService,
    WindowWrapperService,
    LocalStorageService,
    ConfigurationService,
    {
      provide: APP_INITIALIZER,
      useFactory: appConfigInitializerFn,
      multi: true,
      deps: [ConfigurationService]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
