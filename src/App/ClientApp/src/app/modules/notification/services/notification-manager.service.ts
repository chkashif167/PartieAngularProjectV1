import { Injectable } from '@angular/core';
import { pipe, Observable, BehaviorSubject } from 'rxjs';
//Services
import { ApiBaseService } from '@partie/shared/services/api-base.service';

//Models
import { NotificationSetting, UpdateNotificationSettings } from '@partie/notification/models/notification.model';
import { UserNotificationById } from '@partie/notification/models/notification.model';
import { UserNotifications } from '@partie/notification/models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationManagerService extends ApiBaseService {

  private notificationSettings: BehaviorSubject<NotificationSetting[]> = new BehaviorSubject<NotificationSetting[]>([]);
  notificationSettings$: Observable<NotificationSetting[]> = this.notificationSettings.asObservable();

  private getAllNotificationSettings(): void {
    this.get(null, '/notification/getUserNotificationSettings')
      .subscribe((resp: NotificationSetting[]) => {
        this.initialize(resp);
      });
  }

  private setNotificationSettings(notificationSetting: UpdateNotificationSettings): void {
    this.post(notificationSetting, '/notification/updateUserNotification', false)
      .subscribe((resp:any) => {
        
      });
  }

  initialize(initData: NotificationSetting[]): void {
    this.notificationSettings.next(initData);
  }

  loadSettings(): void {
      this.getAllNotificationSettings();
  }

  updateSettings(setting: UpdateNotificationSettings): void {
    this.setNotificationSettings(setting);
  }
  
}

