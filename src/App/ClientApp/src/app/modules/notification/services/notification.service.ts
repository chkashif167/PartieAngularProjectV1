import { Injectable, OnDestroy } from '@angular/core';

import { pipe, Observable, BehaviorSubject, Subject } from 'rxjs';


//Services
import { ApiBaseService } from '@partie/shared/services/api-base.service';

//Models
import { Notification } from '@partie/notification/models/notification.model';
import { takeUntil } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class NotificationService extends ApiBaseService implements OnDestroy {

  private notifications: BehaviorSubject<Notification[]> = new BehaviorSubject<Notification[]>([]);
  notifications$: Observable<Notification[]> = this.notifications.asObservable();
  private teardown$ = new Subject<void>();
  pushChangesSubscribed: boolean;


  private getNotifications(): void {
    this.get(null, '/notification/getAllNotifications')
      .subscribe((resp: Notification[]) => {
        this.initialize(resp);
        this.subscribeToServerPushChanges();
      });
  }



  initialize(initData: Notification[]): void {

    this.notifications.next(initData);
  }

  loadNotification(): void {
    const list = this.notifications.getValue();
    if (list.length === 0)
      this.getNotifications();
  }

  addNotification(notification: Notification): void {
    const list = this.notifications.getValue();
    list.unshift(notification);
    this.notifications.next(list);
  }

  removeNotification(notificationIds: string[]): void {
    
    this.post({ notificationIds: notificationIds }, '/notification/markNotificationRead')
      .subscribe((resp: any) => {
        let list = this.notifications.getValue();
        list = list.filter(x => !notificationIds.includes(x.id));
        this.notifications.next(list);

      });
  }

  private subscribeToServerPushChanges(): void {
    if (this.pushChangesSubscribed) return;


    this.uiUpdateManager.notificationRead
      .pipe(takeUntil(this.teardown$))
      .subscribe((pl: any) => {
        const ids = pl.notificationIds.split(",");
        let list = this.notifications.getValue();

        list = list.filter(x => !ids.includes(x.id));
        this.notifications.next(list);
      });

    this.pushChangesSubscribed = true;
  }

  ngOnDestroy(): void {
    this.teardown$.next();
    this.teardown$.complete();
  }

  removeAllNotification(): void {

    let idList = this.notifications.getValue().map(({ id }) => id);
    this.removeNotification(idList);
  }


}

