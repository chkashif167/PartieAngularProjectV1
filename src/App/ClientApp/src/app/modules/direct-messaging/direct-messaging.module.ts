import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

//Modules
import { DirectMessagingRoutingModule } from '@partie/direct-messaging/direct-messaging-routing.module';
import { ThemeModule } from '@partie/theme/theme.module';
import { DirectiveModule } from '@partie/directive/directive.module';
import { SharedModule } from '@partie/shared/shared.module';
import { VendorModule } from '@partie/vendor/vendor.module';

//Components
import { MessageListComponent } from '@partie/direct-messaging/components/message-list/message-list.component';
import { ConversationComponent } from '@partie/direct-messaging/components/conversation/conversation.component';


//Services
import { DirectChatService } from '@partie/direct-messaging/services/direct-chat.service';


@NgModule({
  declarations: [MessageListComponent, ConversationComponent],
  imports: [
    CommonModule,
    FormsModule,
    DirectMessagingRoutingModule,
    ThemeModule,
    DirectiveModule,
    SharedModule,
    VendorModule

  ],
  providers: [DirectChatService]

})
export class DirectMessagingModule { }
