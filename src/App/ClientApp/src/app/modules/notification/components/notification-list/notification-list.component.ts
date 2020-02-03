import { Component, OnInit } from '@angular/core';

//services
import { NotificationService } from '@partie/notification/services/notification.service';
import { RouteUtilityService } from '@partie/shared/services/route-utility.service';
//Models
import { Notification, NotificationType } from '@partie/notification/models/notification.model';


@Component({
    selector: 'partie-notification-list',
    templateUrl: './notification-list.component.html',
    styleUrls: ['./notification-list.component.css']
})
export class NotificationListComponent implements OnInit {

    notificationType = NotificationType;


    constructor(

        public notificationService: NotificationService,
        private readonly previousRouteService: RouteUtilityService) {

    }

    ngOnInit() { }

    close(): void {
        this.previousRouteService.navigateToPreviousUrl();
    }

    remove(id: string): void {

        this.notificationService.removeNotification([id]);

    }

    trackByFn(index, item) {
        return index;
    }

    removeAll(): void {
        this.notificationService.removeAllNotification();
    }

}
