import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';


//Modules
import { ThemeModule } from '@partie/theme/theme.module';
import { FeedsRoutingModule } from '@partie/feeds/feeds-routing.module';
import { SharedModule } from '@partie/shared/shared.module';
import { VendorModule } from '@partie/vendor/vendor.module';
import { DirectiveModule } from '@partie/modules/directive/directive.module';

//Services 
import { FeedService } from '@partie/feeds/services/feed.service';

//Compnents
import { FeedListComponent } from '@partie/feeds/components/feed-list/feed-list.component';
import { FeedItemComponent } from '@partie/feeds/components/feed-item/feed-item.component';
import { CreatePostComponent } from '@partie/feeds/components/create-post/create-post.component';
import { UserFeedbackComponent } from '@partie/feeds/components/user-feedback/user-feedback.component';




@NgModule({
    declarations: [FeedListComponent, FeedItemComponent, CreatePostComponent, UserFeedbackComponent],
  imports: [
    CommonModule,
    InfiniteScrollModule,
    FeedsRoutingModule,
    ThemeModule,
    SharedModule,
    FormsModule,
    VendorModule,
      DirectiveModule,
      
    ],
    entryComponents: [UserFeedbackComponent],
  providers: [FeedService]

})
export class FeedsModule { }
