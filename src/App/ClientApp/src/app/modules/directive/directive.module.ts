import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FallbackImageDirective } from '@partie/directive/fallback-image.directive';
import { InsertionDirective } from '@partie/directive/insertion.directive';
import { AvatarImageDirective } from '@partie/directive/avatar-image.directive';

@NgModule({
  declarations: [
    InsertionDirective,
    FallbackImageDirective,
    AvatarImageDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    InsertionDirective,
    FallbackImageDirective,
    AvatarImageDirective
  ]
})
export class DirectiveModule { }
