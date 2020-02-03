import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HttpEventType, HttpResponse } from '@angular/common/http';


//Models
import { UserPostRequest } from '@partie/feeds/models/user-post.model';

//Services
import { FeedService } from '@partie/feeds/services/feed.service';
import { PartieToastrService } from '@partie/core/services/partie-toastr.service';
import { CurrentUserService, ICurrentUser } from '@partie/core/services/current-user.service';
import { FileService } from '@partie/core/services/file.service';

@Component({
    selector: 'partie-create-post',
    templateUrl: './create-post.component.html',
    styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit, OnDestroy {

    show = false;
    buttonName: any = 'Public';
    visibleToEveryone = 'Visible to everyone';
    visibleToSelfAndFollowersOnly = 'Visible to followers only';
    postType = this.visibleToEveryone;
    model: UserPostRequest;
    currentUser: ICurrentUser;

    percentDone = 0;
    uploadSuccess: boolean;
    words: string[];

    private teardown$ = new Subject<void>();

    constructor(private readonly feedService: FeedService,
        private readonly toastrService: PartieToastrService,
        private readonly currentUserService: CurrentUserService,
        private readonly fileService: FileService,
        private readonly router: Router) { }

    ngOnInit() {

        this.model = new UserPostRequest();
        this.bindCurrentUser();
    }

    bindCurrentUser(): void {

        this.currentUserService.afterCurrentUserChanged
            .pipe(takeUntil(this.teardown$))
            .subscribe(resp => {

                this.currentUser = resp as ICurrentUser;
            });
    }

    ngOnDestroy(): void {
        this.teardown$.next();
        this.teardown$.complete();
    }

    togglePostType() {

        this.show = !this.show;

        if (this.show) {
            this.buttonName = 'Protected';
            this.postType = this.visibleToSelfAndFollowersOnly;
            this.model.private = true;
        }
        else {
            this.buttonName = 'Public';
            this.postType = this.visibleToEveryone;
            this.model.private = false;
        }
    }

    createUserPost(): void {

        if (!this.model.description.trim() && !this.model.file) {
            this.toastrService.error('Post cannot be empty');
            return;
        }
        this.findAndConvertToLink(this.model.description);
        this.feedService.addUserPost(this.model)
            .pipe(takeUntil(this.teardown$))
            .subscribe(resp => {
                this.uploadPostFile(resp.id);
            });
    }

    private uploadPostFile(postId: string): void {

        if (this.model.file && this.model.file.size > 0) {

            this.fileService.uploadPostFile(this.currentUser.id, postId, 'file', this.model.file)
                .pipe(takeUntil(this.teardown$))
                .subscribe(event => {
                    if (event.type === HttpEventType.UploadProgress) {
                        this.percentDone = Math.round(100 * event.loaded / event.total);
                    } else if (event instanceof HttpResponse) {
                        this.uploadSuccess = true;
                        this.toastrService.success('Post successfully created');
                        this.navigateToFeeds();
                    }
                });
            return;
        }
        this.navigateToFeeds();
    }

    private navigateToFeeds(): void {

        this.router.navigate(['/feed']);
    }

    upload(file: File) {

        this.uploadSuccess = false;
        this.model.file = file;
    }

    findAndConvertToLink(post: string) {

        this.words = post.split(" ");
        var pattern = new RegExp("^(https?:\\/\\/)?" +
            "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" +
            "((\\d{1,3}\\.){3}\\d{1,3}))" +
            "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
            "(\\?[;&a-z\\d%_.~+=-]*)?" +
            "(\\#[-a-z\\d_]*)?$", "i");
        this.words.forEach((value, index) => {
        
            if (pattern.test(value)) {
                if (!value.startsWith("http")) {
                  value = `http://${value}`;
                }
                this.words[index] = `<a href=${value} target="_blank">${value}</a>`;
            }
        });
        this.model.description = this.words.join(" ").toString();
    }
}
