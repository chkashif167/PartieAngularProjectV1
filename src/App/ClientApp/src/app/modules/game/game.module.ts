import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

//Modules
import { GameRoutingModule } from '@partie/game/game-routing.module';
import { SharedModule } from '@partie/shared/shared.module';
import { ThemeModule} from '@partie/modules/theme/theme.module'

//Components
import { GameListComponent } from '@partie/game/components/game-list/game-list.component';
import { GameComponent } from '@partie/game/components/game/game.component';
import { SearchGameComponent } from '@partie/game/components/search-game/search-game.component';
import { from } from 'rxjs';


//Services


@NgModule({
  declarations: [
    GameListComponent,
    GameComponent,
    SearchGameComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    GameRoutingModule,
    SharedModule,
    ThemeModule
  ],
  exports: [
    GameListComponent
  ]
})
export class GameModule { }
