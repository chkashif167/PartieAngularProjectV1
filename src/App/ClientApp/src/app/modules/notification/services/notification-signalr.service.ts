
import { Injectable } from '@angular/core';
import { Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs//operators';
import { HubConnection, HubConnectionBuilder, LogLevel,HubConnectionState } from '@aspnet/signalr';

import { AuthService } from '@partie/core/services/auth.service';
import { PartieToastrService } from '@partie/core/services/partie-toastr.service';
import { UiUpdatesManagerService } from '@partie/core/services/ui-updates-manager.service';
import { NotificationService } from '@partie/notification/services/notification.service';

//Models
import { Notification } from '@partie/notification/models/notification.model';


@Injectable({
  providedIn: 'root'
})
export class NotificationSignalRService {

  //Private fields
  private teardown$ = new Subject<void>();

  constructor(private readonly authService: AuthService,
    private readonly notificationService: NotificationService,
    private readonly toastrService: PartieToastrService,
    private readonly uiUpdateManager:UiUpdatesManagerService) {
  }

  //Properties
  private hubConnection: HubConnection;

  //Functions
  connect(url: string): void {

    const user = this.authService.getUser();
    const userId = this.authService.getClaims() ? this.authService.getClaims().sub : null;
    url = userId ? `${url}?userId=${userId}` : url ;
    this.hubConnection = new HubConnectionBuilder().withUrl(url,
      {
        //skipNegotiation: true,
        accessTokenFactory: () => user ? user.access_token : null
      })
      .configureLogging(LogLevel.Warning).build();

    
  }

  start():Promise<void> {

    const promise = this.hubConnection.start();
    promise.then(() => {

      this.getFromServer('heartBeat', () => {
        console.log('Notification SignalR Service: connection is alive');
      });

      this.logHeartBeat();

      this.getFromServer('notify', (notification: Notification) => {

        this.notificationService.addNotification(notification);
      });

      this.getFromServer('broadcastMessage', (data: any) => {
        this.uiUpdateManager.updateRealtimeUiChanges(data);
      });

    });
    promise.catch(err => console.log('Notification SignalR Service: Error while establishing connection :('));
    return promise;
  }

  private logHeartBeat(): void {
    const source = timer(1000, 20000);
    source.pipe(takeUntil(this.teardown$))
      .subscribe(val => {
        console.log(`Notification SignalR Service: ${val}`);
        if (!this.isConnected()) {
          window.location.reload();
        }
        this.sendToServer('heartBeat');
      });
  }


  stop(): void {

    const promise = this.hubConnection.stop();
    promise.then(() => {
      console.log('Notification SignalR Service: Connection disconnected');
      this.teardown$.next();
      this.teardown$.complete();
    });
  }

  getFromServer(methodName: string, callBack: (...args: any[]) => void): void {

    this.hubConnection.on(methodName, callBack);
  }

  sendToServer(methodName: string, ...args: any[]): Promise<any> {

    return  this.hubConnection.invoke(methodName, ...args)
      .catch(err => console.error(err));
  }

  isConnected(): boolean {
    return this.hubConnection.state === HubConnectionState.Connected;
  }

}
