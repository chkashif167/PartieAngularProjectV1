import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

//Models
import { SearchUserPostResponse, UserStatus } from '@partie/feeds/models/user-post.model';

//Services
import { FeedService } from '@partie/feeds/services/feed.service'
import { CurrentUserService, ICurrentUser } from '@partie/core/services/current-user.service';


@Component({
  selector: 'partie-feed-list',
  templateUrl: './feed-list.component.html',
  styleUrls: ['./feed-list.component.css']
})
export class FeedListComponent implements OnInit, OnDestroy {

  //feeds: SearchUserPostResponse[];
  
  searchKeyword: string;
  currentUser: ICurrentUser;
  private teardown$ = new Subject<void>();

  pageNo: number;
  pageSize: number;
  

  constructor(public readonly feedService: FeedService,
    private readonly currentUserService: CurrentUserService,
    private readonly route: ActivatedRoute) {

    this.pageNo = 1;
    this.pageSize = 10;
  }

  ngOnInit() {

    this.route.params.pipe(takeUntil(this.teardown$)).subscribe(params => {

      const postId = params['postId'];
      this.searchKeyword = postId;
      this.bindCurrentUser();
    });

  }

  ngOnDestroy(): void {
    this.teardown$.next();
    this.teardown$.complete();
  }

  private bindCurrentUser(): void {

    this.currentUserService.afterCurrentUserChanged
      .pipe(takeUntil(this.teardown$))
      .subscribe(resp => {

        this.currentUser = resp as ICurrentUser;
        this.bindFeeds(this.currentUser.id, this.searchKeyword, this.pageNo, this.pageSize);
      });
  }

  private bindFeeds(userId: string, keyword?: string, pageNumber?: number, pageSize?: number): void {
    this.feedService.getUserPosts(userId, keyword, pageNumber, pageSize, false);
  }

  searchFeeds(): void {

    this.pageNo = 1;
   
    this.feedService.clearPosts();
    this.bindFeeds(this.currentUser.id, this.searchKeyword, this.pageNo, this.pageSize);
  }


  onScrollDown(ev): void {

    this.pageNo++;

    console.log(`scrolled down!!, PageNo: ${this.pageNo}`, ev);


    this.feedService.getUserPosts(this.currentUser.id, this.searchKeyword, this.pageNo, this.pageSize);


  }

  onScrollUp(ev): void {
    console.log('scrolled up!!', ev);


  }

  trackByFn(index, item) {
    return item.id;
  }

}
