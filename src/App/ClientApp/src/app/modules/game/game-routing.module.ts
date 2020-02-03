import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GameListComponent } from '@partie/game/components/game-list/game-list.component';

const routes: Routes = [
   { path: '', component: GameListComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GameRoutingModule { }
