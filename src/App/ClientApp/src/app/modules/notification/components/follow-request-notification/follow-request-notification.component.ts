import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

//Services
import { FriendshipService } from '@partie/shared/services/friendship.service';
import { PartieToastrService } from '@partie/core/services/partie-toastr.service';

@Component({
  selector: 'partie-follow-request-notification',
  template: `<div class="btn-group request-actions">
  <button class="btn btn-bare" (click)="deny()"><img src="/assets/images/icons/32px/remove.svg" class="remove-icon" alt="Remove Icon" ></button>
  <button class="btn btn-bare" (click)="accept()"><img src="/assets/images/icons/32px/check.svg" alt="Check Icon" ></button>
</div>
`
})
export class FollowRequestNotificationComponent implements OnInit, OnDestroy {

  @Input() followRequestById: string;
  @Output('onRead') markRead:EventEmitter<null>;

  private teardown$ = new Subject<void>();

  constructor(
    private friendshipService: FriendshipService,
    private toastService: PartieToastrService,) {
    this.markRead = new EventEmitter();
  }

  ngOnInit() {
  }


  deny() {
    this.friendshipService.rejectFollowRequest(this.followRequestById)
      .pipe(takeUntil(this.teardown$))
      .subscribe(result => {
        this.markRead.emit();
        this.toastService.success("Request denied successfully");
      });
  }

  accept() {
    this.friendshipService.acceptFollowRequest(this.followRequestById)
      .pipe(takeUntil(this.teardown$))
      .subscribe(result => {
        this.markRead.emit();
        this.toastService.success("Request accepted successfully");
      });

  }


  ngOnDestroy(): void {
    this.teardown$.next();
    this.teardown$.complete();
  }
}
