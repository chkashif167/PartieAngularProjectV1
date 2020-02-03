import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


//Modules
import { SharedModule } from '@partie/shared/shared.module';

import { FooterComponent } from '@partie/theme/components/footer/footer.component';
import { HeaderComponent } from '@partie/theme/components/header/header.component';
import { DrawerMenuComponent } from '@partie/theme/components/drawer-menu/drawer-menu.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule
  ],
  declarations: [
    FooterComponent,
    HeaderComponent,
    DrawerMenuComponent
  ],
  exports: [
    FooterComponent,
    HeaderComponent,
    DrawerMenuComponent
  ]
 
})
export class ThemeModule { }
