import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';



import { NotificationService } from '@partie/notification/services/notification.service';

import { DrawerMenuComponent } from '@partie/theme/components/drawer-menu/drawer-menu.component';
import { ContextMenu } from '@partie/theme/models/context-menu.model';
import { Notification } from '@partie/notification/models/notification.model';
import { RouteUtilityService } from '@partie/shared/services/route-utility.service';


@Component({
  selector: 'partie-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  @Input() backUrl: string;
  @Input('title') mainTitle: string;
  @Input() subTitle: string;
  @Input('showNotification')
  set setShowNotification(val: string) {
    this.showNotificationButton = val === 'true';
  }

  showNotificationButton: boolean = false;
 
  @Input() contextMenu: ContextMenu[];

  @Output() menuClick: EventEmitter<ContextMenu> = new EventEmitter();

  hasContextMenu: boolean = false;

  btnLeftIcon:string;

  @ViewChild(DrawerMenuComponent) drawerMenu: DrawerMenuComponent;

  notificationImageUrl: string;
  private teardown$ = new Subject<void>();

  constructor(
    private readonly router: Router,
    private readonly notificationService: NotificationService,

    private readonly routeUtilityService: RouteUtilityService) {
    
    this.notificationImageUrl = '/assets/images/icons/24px/notifications.svg';

    
    this.notificationService.notifications$
      .pipe(takeUntil(this.teardown$))
      .subscribe((notifications: Notification[]) => {
        this.notificationImageUrl = '/assets/images/icons/24px/';
        this.notificationImageUrl = notifications.length > 0
          ? `${this.notificationImageUrl}notifications-on.svg`
          : `${this.notificationImageUrl}notifications.svg`;
      });


  }

  ngOnInit() {
    
    this.btnLeftIcon = this.backUrl === undefined
      ? "/assets/images/icons/24px/user-placeholder.svg"
      : "/assets/images/icons/24px/back.svg";

    
    
    this.hasContextMenu = this.contextMenu !== undefined;

  }


  leftButton(): void {

    if (this.backUrl === undefined) {
      this.router.navigateByUrl('/profile');
    } else {
      this.routeUtilityService.navigateToPreviousUrl(this.backUrl);
    }
  }

  showDrawerMenu(): void {
    console.log('Show DrawerMenu');
    this.drawerMenu.toggleMenu(true);
  }

  notification(): void {
    
    this.router.navigateByUrl('/notifications');
  }

  contextMenuClick(item: ContextMenu): void {
    this.menuClick.emit(item);
    this.drawerMenu.toggleMenu(false);
  }

  ngOnDestroy(): void {
    this.teardown$.next();
    this.teardown$.complete();
  }
}
