import { NgModule } from '@angular/core';

import { Routes, RouterModule } from '@angular/router'

//Components
import { FeedListComponent } from '@partie/feeds/components/feed-list/feed-list.component';
import { CreatePostComponent } from '@partie/feeds/components/create-post/create-post.component';

const routes: Routes = [
  { path: '', component: FeedListComponent },
  { path: 'create', component: CreatePostComponent },
  { path: ':postId', component: FeedListComponent }
];

@NgModule({ 
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]

})
export class FeedsRoutingModule { }
