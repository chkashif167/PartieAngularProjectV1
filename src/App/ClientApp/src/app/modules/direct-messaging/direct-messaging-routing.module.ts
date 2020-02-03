import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Components
import { MessageListComponent } from '@partie/direct-messaging/components/message-list/message-list.component';
import { ConversationComponent } from '@partie/direct-messaging/components/conversation/conversation.component';


const routes: Routes = [
  {path: '', component: MessageListComponent, pathMatch: 'full'},
  {path: 'conversation/:id', component: ConversationComponent, pathMatch: 'full'},
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DirectMessagingRoutingModule { }
