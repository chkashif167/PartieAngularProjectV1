import { Injectable, OnDestroy } from '@angular/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';




//Model 
import {
    UserPostRequest,
    SearchUserPostResponse,
    SearchUserPostRequest,
    LikeUserPostRequest,
    LikeUserPostResponse,
    UnlikeUserPostRequest,
    UnlikeUserPostResponse,
    UserStatus

} from '@partie/feeds/models/user-post.model';

import { ApiBaseService } from '@partie/shared/services/api-base.service';


@Injectable({
    providedIn: 'root'
})
export class FeedService extends ApiBaseService implements OnDestroy {

    private teardown$ = new Subject<void>();
    private userFeed: BehaviorSubject<SearchUserPostResponse[]> = new BehaviorSubject<SearchUserPostResponse[]>([]);
    userFeed$: Observable<SearchUserPostResponse[]> = this.userFeed.asObservable();

    private pushChangesSubscribed: boolean;

    getUserPosts(userId: string, keyword?: string, pageNumber = 1, pageSize = 100, appendResponse: boolean = true): void { // Observable<SearchUserPostResponse[]>
        const request = new SearchUserPostRequest();
        request.userId = userId;
        request.keyword = keyword;
        request.pageNumber = pageNumber;
        request.pageSize = pageSize;
        this.post<any, SearchUserPostResponse[]>(request, '/userpost/search', false)
            .subscribe((resp: SearchUserPostResponse[]) => {
                resp.filter(x => x.description != null)
                    .forEach(y => y.description = y.description.replace(/(?:\r\n|\r|\n)/g, '<br/>'));

                let list = this.userFeed.getValue();
                list = appendResponse ? [...list, ...resp] : resp;
                this.userFeed.next(list);
            });

        this.subscribeToServerPushChanges();
    }

    clearPosts(): void {
        this.userFeed.next([]);
    }

    addUserPost(requestData: UserPostRequest): Observable<any> {

        return this.post<UserPostRequest, any>(requestData, '/userpost');
    }

    likeUserPost(requestData: LikeUserPostRequest): void { //Observable<any>

        this.post<LikeUserPostRequest, LikeUserPostResponse>(requestData, '/userpost/like')
            .subscribe(resp => {
                this.updatePostLikes(requestData.postId, resp.likes, true);
            });
    }

    unLikeUserPost(requestData: UnlikeUserPostRequest): void { // Observable<any>

        this.post<UnlikeUserPostRequest, UnlikeUserPostResponse>(requestData, '/userpost/unlike')
            .subscribe(resp => {
                this.updatePostLikes(requestData.postId, resp.likes, false);
            });

    }

    deleteUserPost(postId: string): void { //Observable<any>

        this.post<any, any>({ postId: postId }, '/userpost/delete')
            .subscribe(resp => {
                let list = this.userFeed.getValue();
                list = list.filter(x => x.id !== postId);
                this.userFeed.next(list);
            });
    }

    reportPost(postId: string, reason: string): Observable<any> {

        return this.post<any, any>({ postId: postId, reason: reason }, '/userpost/report');
    }

    updateUserMuteStatus(user: UserStatus): void {
        const list = this.userFeed.getValue();
        list.filter(f => f.createdById === user.userId)
            .forEach(x => x.muted = user.muted);
        this.userFeed.next(list);
    }

    updateUserFollowStatus(user: UserStatus): void {
        const list = this.userFeed.getValue();
        list.filter(f => f.createdById === user.userId)
            .forEach(x => x.following = user.following);
        this.userFeed.next(list);
    }

    getFeedUrl(postId: string): string {
        return `${this.configurationService.applicationUrl}/feed/${postId}`;
    }

    private subscribeToServerPushChanges(): void {
        if (this.pushChangesSubscribed) return;

        this.uiUpdateManager.postLikeChanged
            .pipe(takeUntil(this.teardown$))
            .subscribe((pl: any) => {
                this.updatePostLikes(pl.postId, pl.likesCount, null);
            });

        this.uiUpdateManager.userFollowChanged
            .pipe(takeUntil(this.teardown$))
            .subscribe((pl: any) => {
                this.updateUserFollowStatus({
                    userId: pl.followedUserId,
                    muted: false,
                    following: true
                });

            });

        this.uiUpdateManager.userUnFollowChanged
          .pipe(takeUntil(this.teardown$))
          .subscribe((pl: any) => {
            this.updateUserFollowStatus({
              userId: pl.unFollowedUserId,
              muted: false,
              following: false
            });

          });

        this.pushChangesSubscribed = true;
    }

    private updatePostLikes(postId: string, likes: number, liked?: boolean): void {
        const list = this.userFeed.getValue();
        const post = list.find(x => x.id === postId);
        post.liked = liked !== null ? liked : post.liked;
        post.likes = likes;
        this.userFeed.next(list);
    }


    ngOnDestroy(): void {
        this.teardown$.next();
        this.teardown$.complete();
    }


}
