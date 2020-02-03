import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//Modules
import { ToastrModule } from 'ngx-toastr';
import { NgxMaskModule, IConfig } from 'ngx-mask';
export let options: Partial<IConfig> | (() => Partial<IConfig>) = {};
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ShareButtonModule } from '@ngx-share/button';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ChartsModule } from 'ng2-charts';
import { UiScrollModule } from 'ngx-ui-scroll';

@NgModule({
  imports: [
        CommonModule,
    //BrowserAnimationsModule,
    ToastrModule.forRoot(),
    NgxMaskModule.forRoot(options),
    PickerModule,
    EmojiModule,
    ScrollingModule,
    ShareButtonModule,
        FontAwesomeModule,
    ChartsModule,
        UiScrollModule
  ],
  declarations: [
  ],
  exports: [
    ToastrModule,
    NgxMaskModule,
    PickerModule,
    EmojiModule,
    ScrollingModule,
    ShareButtonModule,
      FontAwesomeModule,
    ChartsModule,
    UiScrollModule
  ],
  providers: []
})
export class VendorModule { }
