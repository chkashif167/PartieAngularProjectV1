import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { RoomUserExistsGuard } from '@partie/core/guards/room-user-exists.guard';

import { AcceptInvitationGuard } from '@partie/core/guards/accept-invitation.guard';

//Components
import { RoomListComponent } from '@partie/room/components/room-list/room-list.component';
import { ChatRoomComponent } from '@partie/room/components/chat-room/chat-room.component';
import { GameListComponent } from '@partie/game/components/game-list/game-list.component';

const routes: Routes = [
  { path: '', redirectTo: 'all', pathMatch: 'full', },
  { path: 'all', component: RoomListComponent, pathMatch: 'full' },
  { path: ':roomId/chat', component: ChatRoomComponent, pathMatch: 'full', canActivate: [RoomUserExistsGuard] }, 
  { path: 'invitation/accept/:roomId',component: ChatRoomComponent, canActivate: [AcceptInvitationGuard] },
  { path: 'create', component: GameListComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoomRoutingModule { }
