import { Component, OnInit } from '@angular/core';
//services
import { NotificationManagerService } from '@partie/notification/services/notification-manager.service';
//Models
import { UpdateNotificationSettings, NotificationSetting } from '@partie/notification/models/notification.model';


@Component({
  selector: 'partie-notification-manager',
  templateUrl: './notification-manager.component.html',
  styleUrls: ['./notification-manager.component.css']
})
export class NotificationManagerComponent implements OnInit {
  obj: UpdateNotificationSettings;

  constructor(
    
    public notificationManagerService: NotificationManagerService) {
   

  }

  ngOnInit() {
    this.notificationManagerService.loadSettings();
  }
 

  togglePushSetting(setting: NotificationSetting): void {
    setting.pushNotification = !setting.pushNotification;
    let changedObj = new UpdateNotificationSettings();
    changedObj.emailNotification = setting.emailNotification;
    changedObj.pushNotification = setting.pushNotification;
    changedObj.notificationId = setting.id;
    this.notificationManagerService.updateSettings(changedObj);

  }


   toggleEmailSetting(setting: NotificationSetting): void {
     setting.emailNotification = !setting.emailNotification;

     let changedObj = new UpdateNotificationSettings();
     changedObj.emailNotification = setting.emailNotification;
     changedObj.pushNotification = setting.pushNotification;
     changedObj.notificationId = setting.id;

     this.notificationManagerService.updateSettings(changedObj);

  }



  trackByFn(index, item) {
    return index;
  }

}
