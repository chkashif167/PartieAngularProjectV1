import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { ModuleMapLoaderModule } from '@nguniversal/module-map-ngfactory-loader';
import { AppComponent } from '@partie/app.component';
import { AppModule } from '@partie/app.module';




@NgModule({
  imports: [
    AppModule,
    ServerModule,
    ModuleMapLoaderModule,

   
  ],
    bootstrap: [AppComponent]
})
export class AppServerModule { }
