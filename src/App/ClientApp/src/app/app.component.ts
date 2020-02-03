

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs//operators';

import { SignalRService } from '@partie/core/services/signalr.service';
import { MessageBus } from '@partie/core/message-bus/message-bus';
import { UtilityService } from '@partie/core/services/utility.service';
import { ConfigurationService } from '@partie/shared/services/configuration.service';


import { NotificationSignalRService } from '@partie/notification/services/notification-signalr.service';
import { RouteUtilityService } from '@partie/shared/services/route-utility.service';
import { NotificationService } from '@partie/notification/services/notification.service';
import { CurrentUserService } from '@partie/core/services/current-user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',

})
export class AppComponent implements OnInit {

  title = 'app';

  //Private fields
  private teardown$ = new Subject<void>();

  constructor(private readonly signalRService: SignalRService,
    private readonly configurationServices: ConfigurationService,
    private readonly utilityService: UtilityService,
    private readonly messageBus: MessageBus,
    private readonly notificationSignalRService: NotificationSignalRService,
    private readonly routeUtilityService: RouteUtilityService,
    private readonly notificationService: NotificationService,
    private readonly currentUserService: CurrentUserService

  ) {

    routeUtilityService.init();
  }

  ngOnInit(): void {

    this.configurationServices.loadConfigurationBehaviorSubject
      .pipe(takeUntil(this.teardown$))
      .subscribe(() => {

        const chatApiUrl = this.configurationServices.chatApiUrl;
        this.signalRService.connect(this.utilityService.combineUrl(chatApiUrl, '/chat'));

        this.signalRService.start();
        this.startSignalRHeatBeat();

        const commApiUrl = this.utilityService.combineUrl(this.configurationServices.commApiUrl, '/notification');
        this.notificationSignalRService.connect(commApiUrl);
        this.notificationSignalRService.start();
      });

    const sub = this.currentUserService.afterCurrentUserChanged
      .subscribe(u => {
        this.notificationService.loadNotification();
        sub.unsubscribe();
      });
    

  }

  private startSignalRHeatBeat(): void {

    this.messageBus.afterStart.pipe(takeUntil(this.teardown$))
      .subscribe(() => {

        this.signalRService.getFromServer('heartBeat', () => {
          console.log('SignalR connection is alive');
        });

        const source = timer(1000, 10000);
        source.pipe(takeUntil(this.teardown$))
          .subscribe(val => {
            console.log(val);
            if (!this.signalRService.isConnected()) {
              window.location.reload();
            }
            this.signalRService.sendToServer('heartBeat');
          });

      });
  }

  ngOnDestroy(): void {
    this.teardown$.next();
    this.teardown$.complete();
  }
}
