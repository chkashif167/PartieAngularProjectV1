import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

//Modules
import { RoomRoutingModule } from '@partie/room/room-routing.module';
import { ThemeModule } from '@partie/theme/theme.module';
import { GameModule } from '@partie/game/game.module';
import { DirectiveModule } from '@partie/directive/directive.module';
import { SharedModule } from '@partie/shared/shared.module';
import { VendorModule } from '@partie/vendor/vendor.module';

//Services

//Components
import { RoomListComponent } from '@partie/room/components/room-list/room-list.component';
import { SearchRoomComponent } from '@partie/room/components/search-room/search-room.component';
import { RoomListItemComponent } from '@partie/room/components/room-list-item/room-list-item.component';
import { ChatRoomComponent } from '@partie/room/components/chat-room/chat-room.component';
import { ChatRoomMessageComponent } from '@partie/room/components/chat-room-message/chat-room-message.component';
import { CreateRoomComponent } from '@partie/room/components/create-room/create-room.component';
import { RoomTagsComponent } from '@partie/room/components/room-tags/room-tags.component'
import { EditRoomComponent } from '@partie/room/components/edit-room/edit-room.component';
import { UserFeedbackComponent } from '@partie/room/components/user-feedback/user-feedback.component';
import { RateHostComponent } from '@partie/room/components/rate-host/rate-host.component';
import { CreateTemplateComponent } from '@partie/modules/room/components/create-template/create-template.component';
import { GamePlatformMapService } from '@partie/shared/services/game-platform-map/game-platform-map.service';



@NgModule({
    declarations: [
        RoomListComponent,
        SearchRoomComponent,
        RoomListItemComponent,
        ChatRoomComponent,
        ChatRoomMessageComponent,
        CreateRoomComponent,
        RoomTagsComponent,
        EditRoomComponent,
        UserFeedbackComponent,
        RateHostComponent,
        CreateTemplateComponent

    ],
    imports: [
        FormsModule,
        CommonModule,
        RoomRoutingModule,
        ThemeModule,
        GameModule,
        DirectiveModule,
        SharedModule,
        VendorModule
        
    ],
    entryComponents: [
        CreateRoomComponent,
        EditRoomComponent,
        UserFeedbackComponent,
        RateHostComponent,
        CreateRoomComponent

    ]
})
export class RoomModule { }
